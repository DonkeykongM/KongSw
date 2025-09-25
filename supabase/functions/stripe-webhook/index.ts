import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Webhook received')
    
    // Get Stripe signature
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      console.error('No Stripe signature found')
      return new Response('No signature', { status: 400, headers: corsHeaders })
    }

    // Get environment variables
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!stripeWebhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return new Response('Webhook secret not configured', { status: 500, headers: corsHeaders })
    }

    // Get request body
    const body = await req.text()
    console.log('Webhook body received, length:', body.length)

    // Verify webhook signature (simplified for now - in production use proper verification)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse the event
    let event
    try {
      event = JSON.parse(body)
      console.log('Event type:', event.type)
    } catch (err) {
      console.error('Failed to parse webhook body:', err)
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders })
    }

    // Handle successful checkout
    if (event.type === 'checkout.session.completed') {
      console.log('Processing checkout.session.completed')
      
      const session = event.data.object
      const customerEmail = session.customer_details?.email
      const customerPassword = session.metadata?.password
      const customerName = session.customer_details?.name || session.metadata?.name
      
      console.log('Customer email:', customerEmail)
      console.log('Customer name:', customerName)
      console.log('Has password in metadata:', !!customerPassword)

      if (!customerEmail || !customerPassword) {
        console.error('Missing customer email or password')
        return new Response('Missing required data', { status: 400, headers: corsHeaders })
      }

      try {
        // Create Supabase account
        console.log('Creating Supabase account for:', customerEmail)
        
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: customerEmail,
          password: customerPassword,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            name: customerName,
            stripe_customer_id: session.customer,
            payment_method: 'stripe',
            course_access: true
          }
        })

        if (authError) {
          console.error('Error creating user:', authError)
          
          // If user already exists, try to update their access
          if (authError.message?.includes('already been registered')) {
            console.log('User already exists, updating access')
            
            // Get existing user
            const { data: users, error: getUserError } = await supabase.auth.admin.listUsers()
            if (getUserError) {
              console.error('Error listing users:', getUserError)
              return new Response('Error updating user access', { status: 500, headers: corsHeaders })
            }
            
            const existingUser = users.users.find(u => u.email === customerEmail)
            if (existingUser) {
              // Update user metadata to grant access
              const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
                user_metadata: {
                  ...existingUser.user_metadata,
                  stripe_customer_id: session.customer,
                  course_access: true,
                  payment_confirmed: true
                }
              })
              
              if (updateError) {
                console.error('Error updating user:', updateError)
              } else {
                console.log('Successfully updated existing user access')
              }
            }
          } else {
            return new Response('Error creating user account', { status: 500, headers: corsHeaders })
          }
        } else {
          console.log('User created successfully:', authData.user.id)
          
          // Create user profile
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([{
              user_id: authData.user.id,
              display_name: customerName || customerEmail.split('@')[0],
              bio: 'Behärskar Napoleon Hills framgångsprinciper',
              goals: 'Bygger rikedom genom tankesättstransformation',
              favorite_module: 'Önskans kraft'
            }])

          if (profileError) {
            console.error('Error creating profile:', profileError)
          } else {
            console.log('Profile created successfully')
          }
        }

        // Store customer information
        const userId = authData?.user?.id
        if (userId) {
          const { error: customerError } = await supabase
            .from('stripe_customers')
            .upsert([{
              user_id: userId,
              customer_id: session.customer,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])

          if (customerError) {
            console.error('Error storing customer:', customerError)
          }
        }

        console.log('Checkout completed successfully for:', customerEmail)
        return new Response('success', { headers: corsHeaders })
        
      } catch (err) {
        console.error('Error in checkout processing:', err)
        return new Response('Internal error', { status: 500, headers: corsHeaders })
      }
    }

    // Handle subscription updates
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
      console.log('Processing subscription event:', event.type)
      
      const subscription = event.data.object
      
      const { error } = await supabase
        .from('stripe_subscriptions')
        .upsert([{
          customer_id: subscription.customer,
          subscription_id: subscription.id,
          price_id: subscription.items.data[0]?.price?.id,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end,
          status: subscription.status,
          updated_at: new Date().toISOString()
        }])

      if (error) {
        console.error('Error updating subscription:', error)
        return new Response('Error updating subscription', { status: 500, headers: corsHeaders })
      }

      return new Response('success', { headers: corsHeaders })
    }

    // Handle one-time payments
    if (event.type === 'payment_intent.succeeded') {
      console.log('Processing payment_intent.succeeded')
      
      const paymentIntent = event.data.object
      
      // Store order information
      const { error: orderError } = await supabase
        .from('stripe_orders')
        .insert([{
          checkout_session_id: paymentIntent.metadata?.checkout_session_id || '',
          payment_intent_id: paymentIntent.id,
          customer_id: paymentIntent.customer || '',
          amount_subtotal: paymentIntent.amount,
          amount_total: paymentIntent.amount,
          currency: paymentIntent.currency,
          payment_status: paymentIntent.status,
          status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])

      if (orderError) {
        console.error('Error storing order:', orderError)
      }

      return new Response('success', { headers: corsHeaders })
    }

    console.log('Unhandled event type:', event.type)
    return new Response('success', { headers: corsHeaders })
    
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response('Internal error', { status: 500, headers: corsHeaders })
  }
})