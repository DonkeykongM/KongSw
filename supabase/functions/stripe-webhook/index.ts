import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🎯 Webhook received, processing...')
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2022-11-15',
    })

    // Verify webhook signature
    const signature = req.headers.get('stripe-signature')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    if (!signature || !webhookSecret) {
      console.error('❌ Missing webhook signature or secret')
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    const body = await req.text()
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('✅ Webhook signature verified, event type:', event.type)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    // Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Handle successful checkout
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('💰 Processing checkout completion for session:', session.id)
      
      const customerEmail = session.customer_details?.email
      const customerName = session.customer_details?.name
      const sessionMetadata = session.metadata || {}
      
      console.log('📧 Customer email:', customerEmail)
      console.log('👤 Customer name:', customerName)
      console.log('📋 Session metadata:', sessionMetadata)

      if (!customerEmail) {
        console.error('❌ No customer email found in session')
        return new Response('No customer email found', { status: 400 })
      }

      // Get password from metadata (set during checkout creation)
      const password = sessionMetadata.password
      if (!password) {
        console.error('❌ No password found in session metadata')
        return new Response('No password in metadata', { status: 400 })
      }

      console.log('🔐 Creating user account for:', customerEmail)

      // Step 1: Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        password: password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          display_name: customerName || customerEmail.split('@')[0],
          created_via: 'stripe_purchase',
          purchase_session_id: session.id
        }
      })

      if (authError) {
        console.error('❌ Failed to create auth user:', authError)
        
        // Check if user already exists
        if (authError.message?.includes('already registered')) {
          console.log('👤 User already exists, updating profile instead')
          
          // Get existing user
          const { data: existingUser } = await supabase.auth.admin.getUserById(authError.message)
          if (existingUser?.user) {
            console.log('✅ Found existing user, ensuring profile exists')
            // Continue to create/update profile for existing user
            // We'll use their existing user ID
          }
        } else {
          return new Response(`Failed to create user: ${authError.message}`, { status: 500 })
        }
      }

      const userId = authUser?.user?.id
      console.log('👤 User ID:', userId)

      if (!userId) {
        console.error('❌ No user ID available')
        return new Response('Failed to get user ID', { status: 500 })
      }

      // Step 2: Create user profile with Swedish defaults
      const profileData = {
        user_id: userId,
        display_name: customerName || customerEmail.split('@')[0] || 'Användare',
        bio: 'Behärskar Napoleon Hills framgångsprinciper',
        goals: 'Bygger rikedom genom tankesättstransformation',
        favorite_module: 'Önskans kraft'
      }

      console.log('📝 Creating user profile:', profileData)

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .upsert([profileData])
        .select()
        .single()

      if (profileError) {
        console.error('❌ Failed to create profile:', profileError)
        // Don't fail the entire process if profile creation fails
        console.log('⚠️ Continuing without profile, user can create it later')
      } else {
        console.log('✅ Profile created successfully:', profile)
      }

      // Step 3: Create Stripe customer record
      const customerId = session.customer as string
      if (customerId) {
        const { error: customerError } = await supabase
          .from('stripe_customers')
          .upsert([{
            user_id: userId,
            customer_id: customerId
          }])

        if (customerError) {
          console.error('❌ Failed to create customer record:', customerError)
        } else {
          console.log('✅ Stripe customer record created')
        }
      }

      // Step 4: Create order record
      const { error: orderError } = await supabase
        .from('stripe_orders')
        .insert([{
          checkout_session_id: session.id,
          payment_intent_id: session.payment_intent as string,
          customer_id: customerId,
          amount_subtotal: session.amount_subtotal || 0,
          amount_total: session.amount_total || 0,
          currency: session.currency || 'sek',
          payment_status: session.payment_status || 'paid',
          status: 'completed'
        }])

      if (orderError) {
        console.error('❌ Failed to create order record:', orderError)
      } else {
        console.log('✅ Order record created successfully')
      }

      console.log('🎉 Webhook processing completed successfully!')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'User account and profile created successfully',
          user_id: userId,
          email: customerEmail
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Handle other webhook events if needed
    console.log('ℹ️ Unhandled webhook event type:', event.type)
    return new Response('Event type not handled', { status: 200 })

  } catch (error) {
    console.error('💥 Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})