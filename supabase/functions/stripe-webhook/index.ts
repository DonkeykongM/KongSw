import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🎯 Webhook received')
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify webhook signature
    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    
    if (!signature) {
      console.error('❌ No Stripe signature found')
      return new Response('No signature', { status: 400 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      )
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    console.log('✅ Webhook verified, event type:', event.type)

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      
      console.log('💳 Processing checkout session:', session.id)
      console.log('📧 Customer email:', session.customer_email)
      
      // Extract user data from metadata
      const email = session.metadata?.email || session.customer_email
      const password = session.metadata?.password
      const name = session.metadata?.name || session.customer_details?.name || 'Kursdeltagare'
      
      if (!email || !password) {
        console.error('❌ Missing email or password in session metadata')
        return new Response('Missing user data', { status: 400 })
      }

      console.log('👤 Creating user with email:', email)

      try {
        // Step 1: Create auth user first
        console.log('🔐 Creating auth user...')
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: password,
          email_confirm: false,
          user_metadata: {
            display_name: name,
            source: 'stripe_purchase',
            stripe_customer_id: session.customer,
            purchase_date: new Date().toISOString()
          }
        })

        if (authError) {
          console.error('❌ Auth user creation failed:', authError)
          
          // If user already exists, try to get existing user
          if (authError.message?.includes('already registered')) {
            console.log('👤 User already exists, fetching existing user...')
            
            const { data: existingUsers, error: fetchError } = await supabaseAdmin.auth.admin.listUsers()
            
            if (!fetchError && existingUsers?.users) {
              const existingUser = existingUsers.users.find(u => u.email === email)
              if (existingUser) {
                console.log('✅ Found existing user:', existingUser.id)
                
                // Update existing user's metadata
                const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                  existingUser.id,
                  {
                    user_metadata: {
                      ...existingUser.user_metadata,
                      stripe_customer_id: session.customer,
                      purchase_date: new Date().toISOString(),
                      last_purchase: session.id
                    }
                  }
                )
                
                if (updateError) {
                  console.error('❌ Failed to update existing user:', updateError)
                } else {
                  console.log('✅ Updated existing user metadata')
                }
                
                // Use existing user for further operations
                authData = { user: existingUser }
              }
            }
          }
          
          if (!authData?.user) {
            throw new Error(`Auth user creation failed: ${authError.message}`)
          }
        } else {
          console.log('✅ Auth user created successfully:', authData.user.id)
        }

        const userId = authData.user.id

        // Step 2: Store purchase data
        console.log('💾 Storing purchase data...')
        const { error: purchaseError } = await supabaseAdmin
          .from('course_purchases')
          .insert({
            user_id: userId,
            email: email,
            stripe_customer_id: session.customer,
            stripe_session_id: session.id,
            payment_status: session.payment_status,
            amount_paid: session.amount_total,
            currency: session.currency,
            auth_user_created: true,
            profile_created: false
          })

        if (purchaseError) {
          console.error('❌ Purchase storage failed:', purchaseError)
        } else {
          console.log('✅ Purchase data stored')
        }

        // Step 3: Store in simple_logins (fallback table)
        console.log('💾 Storing in simple_logins...')
        const { error: simpleLoginError } = await supabaseAdmin
          .from('simple_logins')
          .insert({
            email: email,
            password_hash: `stripe_purchase_${session.id}`, // Placeholder since we use auth.users
            display_name: name,
            stripe_customer_id: session.customer,
            course_access: true
          })

        if (simpleLoginError) {
          console.error('❌ Simple logins storage failed:', simpleLoginError)
        } else {
          console.log('✅ Simple logins data stored')
        }

        // Step 4: Create user profile
        console.log('👤 Creating user profile...')
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            user_id: userId,
            email: email,
            display_name: name,
            bio: 'Behärskar Napoleon Hills framgångsprinciper',
            goals: 'Bygger rikedom genom tankesättstransformation',
            favorite_module: 'Önskans kraft',
            purchase_date: new Date().toISOString(),
            stripe_customer_id: session.customer
          })

        if (profileError) {
          console.error('❌ Profile creation failed:', profileError)
        } else {
          console.log('✅ User profile created')
          
          // Update purchase record to mark profile as created
          await supabaseAdmin
            .from('course_purchases')
            .update({ profile_created: true })
            .eq('stripe_session_id', session.id)
        }

        console.log('🎉 User setup completed successfully!')
        console.log('📧 User can now login with:', email)

      } catch (error) {
        console.error('❌ User creation process failed:', error)
        return new Response(`User creation failed: ${error.message}`, { 
          status: 500,
          headers: corsHeaders 
        })
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return new Response(`Webhook Error: ${error.message}`, { 
      status: 500,
      headers: corsHeaders 
    })
  }
})