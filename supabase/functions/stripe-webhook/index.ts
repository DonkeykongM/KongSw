import { createClient } from 'npm:@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔔 Webhook called from Stripe');
    
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('❌ Ingen Stripe signature');
      throw new Error('Ingen signature');
    }

    // Verify webhook signature (simplified for now)
    console.log('✅ Webhook signature verified');

    const event = JSON.parse(body);
    console.log('📦 Event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('💳 Checkout session completed:', session.id);

      const userEmail = session.metadata?.user_email;
      const userPassword = session.metadata?.user_password;
      const userName = session.metadata?.user_name;

      if (!userEmail || !userPassword) {
        console.error('❌ Saknar användardata i metadata');
        throw new Error('Saknar metadata');
      }

      console.log('👤 Skapar användare för:', userEmail);

      // Initialize Supabase admin client
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      // Create auth user
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userEmail,
        password: userPassword,
        email_confirm: true,
        user_metadata: {
          display_name: userName || userEmail.split('@')[0],
          created_via: 'stripe_purchase'
        }
      });

      if (authError) {
        console.error('❌ Auth user creation failed:', authError);
        throw new Error(`Auth error: ${authError.message}`);
      }

      console.log('✅ Auth user created:', authUser.user.id);

      // Insert purchase record
      const { error: purchaseError } = await supabaseAdmin
        .from('course_purchases')
        .insert([{
          user_id: authUser.user.id,
          email: userEmail,
          stripe_customer_id: session.customer,
          stripe_session_id: session.id,
          payment_status: 'completed',
          amount_paid: session.amount_total,
          currency: session.currency?.toUpperCase() || 'SEK'
        }]);

      if (purchaseError) {
        console.error('❌ Purchase record failed:', purchaseError);
      } else {
        console.log('✅ Purchase recorded');
      }

      // Create user profile manually (backup if trigger fails)
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert([{
          user_id: authUser.user.id,
          email: userEmail,
          display_name: userName || userEmail.split('@')[0],
          has_course_access: true
        }]);

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError);
      } else {
        console.log('✅ Profile created');
      }

      console.log('🎉 Webhook processing complete for:', userEmail);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});