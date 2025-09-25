import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CustomerMetadata {
  email: string;
  password: string;
  name?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🎯 Webhook received')
    
    // Get environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing required environment variables')
      return new Response('Server configuration error', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    // Initialize clients
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Get the request body and signature
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('❌ No Stripe signature found')
      return new Response('No signature', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Verify the webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('✅ Webhook signature verified:', event.type)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return new Response('Webhook signature verification failed', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('💳 Processing completed checkout session:', session.id)

      // Get customer metadata
      const metadata = session.metadata as CustomerMetadata | null
      
      if (!metadata?.email || !metadata?.password) {
        console.error('❌ Missing email or password in session metadata')
        return new Response('Missing required metadata', { 
          status: 400,
          headers: corsHeaders 
        })
      }

      console.log('📧 Creating user for email:', metadata.email)

      try {
        // Step 1: Create Auth user with admin client
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: metadata.email,
          password: metadata.password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            created_via: 'stripe_purchase',
            purchase_session_id: session.id,
            created_at: new Date().toISOString()
          }
        })

        if (authError) {
          console.error('❌ Failed to create auth user:', authError)
          throw new Error(`Auth creation failed: ${authError.message}`)
        }

        if (!authUser.user) {
          console.error('❌ No user returned from auth creation')
          throw new Error('No user returned from auth creation')
        }

        console.log('✅ Auth user created:', authUser.user.id)

        // Step 2: Create user profile
        const displayName = metadata.name || metadata.email.split('@')[0] || 'Användare'
        
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            user_id: authUser.user.id,
            display_name: displayName,
            bio: 'Behärskar Napoleon Hills framgångsprinciper',
            goals: 'Bygger rikedom genom tankesättstransformation',
            favorite_module: 'Önskans kraft'
          })

        if (profileError) {
          console.error('❌ Failed to create user profile:', profileError)
          throw new Error(`Profile creation failed: ${profileError.message}`)
        }

        console.log('✅ User profile created for user:', authUser.user.id)

        // Step 3: Create Stripe customer record (if we have a customer ID)
        if (session.customer) {
          const { error: customerError } = await supabaseAdmin
            .from('stripe_customers')
            .insert({
              user_id: authUser.user.id,
              customer_id: session.customer as string,
            })

          if (customerError) {
            console.error('⚠️ Failed to create stripe_customers record:', customerError)
            // Don't throw here - this is not critical for user access
          } else {
            console.log('✅ Stripe customer record created')
          }
        }

        // Step 4: Create order record
        if (session.payment_intent) {
          const { error: orderError } = await supabaseAdmin
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
            })

          if (orderError) {
            console.error('⚠️ Failed to create order record:', orderError)
            // Don't throw here - this is not critical for user access
          } else {
            console.log('✅ Order record created')
          }
        }

        console.log('🎉 User setup completed successfully for:', metadata.email)

        return new Response(
          JSON.stringify({ 
            received: true, 
            message: 'User created successfully',
            user_id: authUser.user.id 
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )

      } catch (error) {
        console.error('❌ Error in user creation process:', error)
        
        // Try to get more details about the error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('❌ Detailed error:', errorMessage)

        return new Response(
          JSON.stringify({ 
            error: 'User creation failed', 
            details: errorMessage,
            session_id: session.id 
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Handle other webhook events (for future use)
    console.log('ℹ️ Unhandled webhook event type:', event.type)
    
    return new Response(
      JSON.stringify({ received: true, event_type: event.type }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ Webhook handler error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})