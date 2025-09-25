import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const stripe = (await import('https://esm.sh/stripe@14.21.0')).default(
  Deno.env.get('STRIPE_SECRET_KEY') || '',
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔥 Webhook received!')
    
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify webhook signature
    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      console.error('❌ Missing signature or webhook secret')
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('✅ Webhook signature verified, event type:', event.type)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 })
    }

    // Handle successful payments
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('💳 Checkout completed for:', session.customer_email)
      
      // Extract metadata from checkout session
      const email = session.customer_email || session.metadata?.email
      const password = session.metadata?.password
      const name = session.metadata?.name || email?.split('@')[0] || 'User'
      
      if (!email || !password) {
        console.error('❌ Missing email or password in metadata')
        console.log('Session metadata:', session.metadata)
        return new Response('Missing required user data', { status: 400 })
      }

      console.log('🔐 Creating auth user for:', email)

      // 1. Create Auth User
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          name: name,
          source: 'stripe_purchase',
          stripe_customer_id: session.customer
        }
      })

      if (authError) {
        console.error('❌ Auth user creation failed:', authError)
        return new Response(`Auth user creation failed: ${authError.message}`, { status: 500 })
      }

      console.log('✅ Auth user created:', authUser.user.id)

      // 2. Create or Update Stripe Customer record
      const { error: customerError } = await supabaseAdmin
        .from('stripe_customers')
        .upsert({
          user_id: authUser.user.id,
          customer_id: session.customer,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (customerError) {
        console.error('❌ Stripe customer creation failed:', customerError)
        return new Response(`Stripe customer creation failed: ${customerError.message}`, { status: 500 })
      }

      console.log('✅ Stripe customer record created/updated')

      // 3. Create User Profile (will be created automatically by trigger)
      console.log('✅ User profile will be created automatically by trigger')

      // 4. Create Order Record
      const { error: orderError } = await supabaseAdmin
        .from('stripe_orders')
        .insert({
          checkout_session_id: session.id,
          payment_intent_id: session.payment_intent,
          customer_id: session.customer,
          amount_subtotal: session.amount_subtotal || 0,
          amount_total: session.amount_total || 0,
          currency: session.currency || 'sek',
          payment_status: session.payment_status || 'paid',
          status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (orderError) {
        console.error('❌ Order creation failed:', orderError)
        // Don't fail the webhook for this
      } else {
        console.log('✅ Order record created')
      }

      console.log('🎉 Complete user setup finished for:', email)
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'User account created successfully',
        user_id: authUser.user.id,
        email: email
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Handle subscription updates
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object
      console.log('💰 Payment succeeded for customer:', invoice.customer)
      
      // Update subscription status
      const { error } = await supabaseAdmin
        .from('stripe_subscriptions')
        .upsert({
          customer_id: invoice.customer,
          subscription_id: invoice.subscription,
          status: 'active',
          updated_at: new Date().toISOString()
        })
      
      if (error) {
        console.error('❌ Subscription update failed:', error)
      } else {
        console.log('✅ Subscription updated')
      }
    }

    // Handle subscription cancellations
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object
      console.log('❌ Subscription cancelled for customer:', subscription.customer)
      
      const { error } = await supabaseAdmin
        .from('stripe_subscriptions')
        .update({
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('subscription_id', subscription.id)
      
      if (error) {
        console.error('❌ Subscription cancellation update failed:', error)
      } else {
        console.log('✅ Subscription cancellation recorded')
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('🚨 Webhook error:', error)
    return new Response(`Webhook error: ${error.message}`, { 
      status: 500,
      headers: corsHeaders 
    })
  }
})