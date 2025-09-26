import { createClient } from 'npm:@supabase/supabase-js@2.51.0';

// Initialize Supabase client with service role
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

Deno.serve(async (req: Request) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    // Verify webhook signature
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!signature || !webhookSecret) {
      console.error('Missing webhook signature or secret');
      return new Response('Webhook signature verification failed', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    const body = await req.text();
    console.log('🔥 WEBHOOK RECEIVED:', body.substring(0, 200));

    // Parse webhook event
    let event: WebhookEvent;
    try {
      event = JSON.parse(body);
    } catch (err) {
      console.error('Failed to parse webhook body:', err);
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
    }

    console.log('📦 EVENT TYPE:', event.type);
    console.log('📦 EVENT ID:', event.id);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('💰 CHECKOUT COMPLETED for session:', session.id);
        console.log('📧 Customer email:', session.customer_email);
        console.log('💴 Amount:', session.amount_total, session.currency);
        console.log('🏷️ Metadata:', session.metadata);

        // Extract user info from metadata
        const userEmail = session.metadata?.email || session.customer_email;
        const userPassword = session.metadata?.password;
        const userName = session.metadata?.name || userEmail?.split('@')[0] || 'User';

        if (!userEmail) {
          console.error('❌ No email found in session');
          return new Response('Missing email', { status: 400, headers: corsHeaders });
        }

        console.log('👤 Creating user for:', userEmail);

        // Step 1: Create auth user
        let authUser;
        try {
          const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
            email: userEmail,
            password: userPassword || 'TempPass123!',
            email_confirm: true, // Auto-confirm email
            user_metadata: {
              name: userName,
              source: 'stripe_purchase'
            }
          });

          if (authError) {
            // Check if user already exists
            if (authError.message?.includes('already registered')) {
              console.log('👤 User already exists, getting existing user');
              const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
              
              if (listError) {
                throw new Error(`Failed to find existing user: ${listError.message}`);
              }
              
              authUser = users.find(u => u.email === userEmail);
              if (!authUser) {
                throw new Error('User exists but could not be found');
              }
            } else {
              throw new Error(`Auth creation failed: ${authError.message}`);
            }
          } else {
            authUser = user;
          }

          console.log('✅ Auth user ready:', authUser?.id, authUser?.email);
        } catch (err) {
          console.error('❌ Auth user creation failed:', err);
          return new Response(`Auth creation failed: ${err}`, { status: 500, headers: corsHeaders });
        }

        if (!authUser) {
          console.error('❌ No auth user available');
          return new Response('Failed to create auth user', { status: 500, headers: corsHeaders });
        }

        // Step 2: Create or update stripe customer
        try {
          const { error: customerError } = await supabase
            .from('stripe_customers')
            .upsert({
              user_id: authUser.id,
              customer_id: session.customer,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'customer_id'
            });

          if (customerError) {
            console.error('❌ Customer creation failed:', customerError);
            return new Response(`Customer creation failed: ${customerError.message}`, { 
              status: 500, 
              headers: corsHeaders 
            });
          }

          console.log('✅ Stripe customer created/updated');
        } catch (err) {
          console.error('❌ Customer creation error:', err);
          return new Response(`Customer creation error: ${err}`, { status: 500, headers: corsHeaders });
        }

        // Ensure user profile is created (fallback if trigger doesn't work)
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: authUser.id,
            display_name: userName || userEmail.split('@')[0] || 'Användare',
            bio: 'Behärskar Napoleon Hills framgångsprinciper',
            goals: 'Bygger rikedom genom tankesättstransformation',
            favorite_module: 'Önskans kraft',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id' // Don't overwrite if profile already exists
          });

        if (profileError) {
          console.error('Failed to create user profile, but continuing:', profileError);
          // Don't throw error - profile creation is not critical for basic access
        }

        // Step 3: Create order record
        try {
          const { error: orderError } = await supabase
            .from('stripe_orders')
            .insert({
              checkout_session_id: session.id,
              payment_intent_id: session.payment_intent,
              customer_id: session.customer,
              amount_subtotal: session.amount_subtotal,
              amount_total: session.amount_total,
              currency: session.currency,
              payment_status: session.payment_status,
              status: 'completed',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (orderError) {
            console.error('❌ Order creation failed:', orderError);
            // Don't fail the webhook for order creation issues
          } else {
            console.log('✅ Order record created');
          }
        } catch (err) {
          console.error('❌ Order creation error:', err);
          // Continue even if order fails
        }

        // Step 4: User profile will be created automatically by trigger
        console.log('🎯 WEBHOOK PROCESSING COMPLETE for:', userEmail);
        
        return new Response('Success', { status: 200, headers: corsHeaders });
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('💳 Payment succeeded for:', paymentIntent.id);
        
        // Update order status if it exists
        try {
          const { error } = await supabase
            .from('stripe_orders')
            .update({ 
              payment_status: 'paid',
              updated_at: new Date().toISOString()
            })
            .eq('payment_intent_id', paymentIntent.id);

          if (error) {
            console.error('Failed to update order payment status:', error);
          }
        } catch (err) {
          console.error('Error updating payment status:', err);
        }

        return new Response('Success', { status: 200, headers: corsHeaders });
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('📋 Subscription event:', subscription.id, subscription.status);

        try {
          const { error } = await supabase
            .from('stripe_subscriptions')
            .upsert({
              customer_id: subscription.customer,
              subscription_id: subscription.id,
              price_id: subscription.items.data[0]?.price?.id,
              current_period_start: subscription.current_period_start,
              current_period_end: subscription.current_period_end,
              cancel_at_period_end: subscription.cancel_at_period_end,
              status: subscription.status,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'customer_id'
            });

          if (error) {
            console.error('Subscription upsert failed:', error);
          }
        } catch (err) {
          console.error('Subscription processing error:', err);
        }

        return new Response('Success', { status: 200, headers: corsHeaders });
      }

      default:
        console.log('🔍 Unhandled event type:', event.type);
        return new Response('Event type not handled', { status: 200, headers: corsHeaders });
    }

  } catch (error) {
    console.error('🚨 WEBHOOK ERROR:', error);
    return new Response(`Webhook error: ${error}`, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});