import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    // Get environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeSecretKey || !stripeWebhookSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables');
      return new Response('Configuration error', { status: 500, headers: corsHeaders });
    }

    // Initialize Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Get raw body and signature
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('No stripe signature found');
      return new Response('No signature', { status: 400, headers: corsHeaders });
    }

    // Verify webhook signature using manual verification
    const elements = signature.split(',');
    const signatureHash = elements.find(el => el.startsWith('v1='))?.split('v1=')[1];
    const timestamp = elements.find(el => el.startsWith('t='))?.split('t=')[1];

    if (!signatureHash || !timestamp) {
      console.error('Invalid signature format');
      return new Response('Invalid signature', { status: 400, headers: corsHeaders });
    }

    // Create expected signature
    const encoder = new TextEncoder();
    const data = encoder.encode(timestamp + '.' + body);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(stripeWebhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const expectedSignature = await crypto.subtle.sign('HMAC', key, data);
    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Verify signature
    if (signatureHash !== expectedHex) {
      console.error('Signature verification failed');
      return new Response('Invalid signature', { status: 400, headers: corsHeaders });
    }

    // Parse the event
    const event = JSON.parse(body);
    console.log('Processing webhook event:', event.type);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing checkout session:', session.id);

      const email = session.metadata?.email || session.customer_details?.email;
      const password = session.metadata?.password;
      const name = session.metadata?.name || email?.split('@')[0] || 'Användare';

      if (!email || !password) {
        console.error('Missing email or password in session metadata');
        return new Response('Missing user data', { status: 400, headers: corsHeaders });
      }

      console.log('Creating user account for:', email);

      try {
        // Step 1: Create auth user
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: email,
          password: password,
          email_confirm: true, // Skip email confirmation
          user_metadata: {
            created_via: 'stripe_purchase',
            stripe_customer_id: session.customer,
            stripe_session_id: session.id
          }
        });

        if (authError) {
          console.error('Error creating auth user:', authError);
          
          // If user already exists, try to get them
          if (authError.message?.includes('already registered')) {
            console.log('User already exists, fetching existing user');
            const { data: existingUser, error: fetchError } = await supabase.auth.admin.getUserById(
              authError.user?.id || ''
            );
            
            if (fetchError) {
              // Try to find by email
              const { data: users, error: listError } = await supabase.auth.admin.listUsers();
              if (!listError) {
                const foundUser = users.users.find(u => u.email === email);
                if (foundUser) {
                  console.log('Found existing user by email:', foundUser.id);
                  authUser.user = foundUser;
                }
              }
            } else {
              authUser.user = existingUser.user;
            }
          }
          
          if (!authUser?.user) {
            throw new Error(`Failed to create or fetch auth user: ${authError.message}`);
          }
        }

        const userId = authUser.user.id;
        console.log('Auth user created/found with ID:', userId);

        // Step 2: Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert([
            {
              user_id: userId,
              display_name: name,
              bio: 'Behärskar Napoleon Hills framgångsprinciper',
              goals: 'Bygger rikedom genom tankesättstransformation',
              favorite_module: 'Önskans kraft'
            }
          ], {
            onConflict: 'user_id'
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        } else {
          console.log('User profile created successfully');
        }

        // Step 3: Create stripe customer record
        const { error: customerError } = await supabase
          .from('stripe_customers')
          .upsert([
            {
              user_id: userId,
              customer_id: session.customer
            }
          ], {
            onConflict: 'customer_id'
          });

        if (customerError) {
          console.error('Error creating stripe customer:', customerError);
        } else {
          console.log('Stripe customer record created');
        }

        // Step 4: Create order record
        const { error: orderError } = await supabase
          .from('stripe_orders')
          .insert([
            {
              checkout_session_id: session.id,
              payment_intent_id: session.payment_intent,
              customer_id: session.customer,
              amount_subtotal: session.amount_subtotal,
              amount_total: session.amount_total,
              currency: session.currency,
              payment_status: session.payment_status,
              status: 'completed'
            }
          ]);

        if (orderError) {
          console.error('Error creating order:', orderError);
        } else {
          console.log('Order record created successfully');
        }

        console.log(`✅ User ${email} created successfully with full course access!`);

      } catch (error) {
        console.error('Error in user creation process:', error);
        // Don't return error response for webhooks, as Stripe will retry
      }
    }

    return new Response('OK', { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 500, headers: corsHeaders });
  }
});