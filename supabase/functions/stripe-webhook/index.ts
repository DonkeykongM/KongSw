import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@13.11.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface WebhookPayload {
  type: string;
  data: {
    object: any;
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🎯 Webhook received:', req.method);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify webhook signature
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!signature || !webhookSecret) {
      console.error('❌ Missing signature or webhook secret');
      return new Response('Webhook signature verification failed', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook signature verified, event type:', event.type);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return new Response(`Webhook signature verification failed: ${err}`, { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Handle different event types
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('💳 Processing checkout session:', session.id);

      // Get customer email and metadata
      const customerEmail = session.customer_details?.email || session.customer_email;
      const userPassword = session.metadata?.password;
      const userName = session.metadata?.name || customerEmail?.split('@')[0];

      if (!customerEmail) {
        console.error('❌ No customer email found in session');
        return new Response('No customer email found', { 
          status: 400, 
          headers: corsHeaders 
        });
      }

      if (!userPassword) {
        console.error('❌ No password found in session metadata');
        return new Response('No password found in metadata', { 
          status: 400, 
          headers: corsHeaders 
        });
      }

      console.log(`👤 Creating user account for: ${customerEmail}`);

      try {
        // 1. Create user in Supabase Auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: customerEmail,
          password: userPassword,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            name: userName,
            created_via: 'stripe_checkout',
            stripe_customer_id: session.customer,
          }
        });

        if (authError) {
          console.error('❌ Failed to create auth user:', authError);
          return new Response(`Failed to create user: ${authError.message}`, { 
            status: 500, 
            headers: corsHeaders 
          });
        }

        console.log('✅ Auth user created successfully:', authUser.user?.id);

        // 2. Create user profile in user_profiles table
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: authUser.user!.id,
            display_name: userName || 'Användare',
            bio: 'Behärskar Napoleon Hills framgångsprinciper',
            goals: 'Bygger rikedom genom tankesättstransformation',
            favorite_module: 'Önskans kraft'
          });

        if (profileError) {
          console.error('❌ Failed to create user profile:', profileError);
          // Don't fail the webhook for profile creation errors
          console.log('⚠️ Profile creation failed, but continuing...');
        } else {
          console.log('✅ User profile created successfully');
        }

        // 3. Create Stripe customer record
        const { error: customerError } = await supabase
          .from('stripe_customers')
          .insert({
            user_id: authUser.user!.id,
            customer_id: session.customer as string,
          });

        if (customerError) {
          console.error('❌ Failed to create stripe customer record:', customerError);
          // Don't fail the webhook for customer record errors
          console.log('⚠️ Customer record creation failed, but continuing...');
        } else {
          console.log('✅ Stripe customer record created');
        }

        // 4. Create order record
        const { error: orderError } = await supabase
          .from('stripe_orders')
          .insert({
            checkout_session_id: session.id,
            payment_intent_id: session.payment_intent as string,
            customer_id: session.customer as string,
            amount_subtotal: session.amount_subtotal || 0,
            amount_total: session.amount_total || 0,
            currency: session.currency || 'sek',
            payment_status: session.payment_status || 'paid',
            status: 'completed'
          });

        if (orderError) {
          console.error('❌ Failed to create order record:', orderError);
          // Don't fail the webhook for order record errors
          console.log('⚠️ Order record creation failed, but continuing...');
        } else {
          console.log('✅ Order record created');
        }

        console.log('🎉 User setup completed successfully for:', customerEmail);

      } catch (error) {
        console.error('❌ Error in user creation process:', error);
        return new Response(`Error creating user: ${error}`, { 
          status: 500, 
          headers: corsHeaders 
        });
      }
    }

    // Handle subscription events (for future subscription products)
    else if (event.type === 'customer.subscription.created' || 
             event.type === 'customer.subscription.updated' || 
             event.type === 'customer.subscription.deleted') {
      
      const subscription = event.data.object as Stripe.Subscription;
      console.log('📱 Processing subscription event:', event.type, subscription.id);

      try {
        const { error } = await supabase
          .from('stripe_subscriptions')
          .upsert({
            customer_id: subscription.customer as string,
            subscription_id: subscription.id,
            price_id: subscription.items.data[0]?.price.id,
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            cancel_at_period_end: subscription.cancel_at_period_end,
            status: subscription.status,
          });

        if (error) {
          console.error('❌ Failed to update subscription:', error);
          return new Response(`Failed to update subscription: ${error.message}`, { 
            status: 500, 
            headers: corsHeaders 
          });
        }

        console.log('✅ Subscription updated successfully');
      } catch (error) {
        console.error('❌ Error processing subscription:', error);
        return new Response(`Error processing subscription: ${error}`, { 
          status: 500, 
          headers: corsHeaders 
        });
      }
    }

    else {
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new Response(`Webhook error: ${error}`, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});