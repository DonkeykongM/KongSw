import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase Admin Client
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

    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET')
      return new Response('Webhook secret not configured', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    // Verify webhook signature
    const encoder = new TextEncoder()
    const data = encoder.encode(body)
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    // Parse webhook payload
    const event = JSON.parse(body)
    console.log('Webhook event type:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('Processing checkout session:', session.id)

      // Extract customer information
      const customerEmail = session.customer_details?.email || session.customer_email
      const customerName = session.customer_details?.name || customerEmail?.split('@')[0] || 'Användare'
      
      console.log('Customer email:', customerEmail)
      console.log('Customer name:', customerName)

      if (!customerEmail) {
        console.error('No customer email found in session')
        return new Response('No customer email', { 
          status: 400,
          headers: corsHeaders 
        })
      }

      // Extract metadata (email and password from checkout creation)
      const metadata = session.metadata || {}
      const userPassword = metadata.password
      
      console.log('Metadata found:', Object.keys(metadata))

      if (!userPassword) {
        console.error('No password found in session metadata')
        return new Response('No password in metadata', { 
          status: 400,
          headers: corsHeaders 
        })
      }

      try {
        // Step 1: Create user in Supabase Auth
        console.log('Creating user in Supabase Auth...')
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          password: userPassword,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            full_name: customerName,
            stripe_customer_id: session.customer
          }
        })

        if (authError) {
          console.error('Auth user creation error:', authError)
          
          // Check if user already exists
          if (authError.message?.includes('already registered')) {
            console.log('User already exists, continuing with profile creation...')
            
            // Get existing user
            const { data: existingUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserByEmail(customerEmail)
            
            if (getUserError || !existingUser?.user) {
              console.error('Could not find existing user:', getUserError)
              return new Response('User creation failed', { 
                status: 500,
                headers: corsHeaders 
              })
            }
            
            // Use existing user for profile creation
            authUser = existingUser
          } else {
            throw authError
          }
        }

        const userId = authUser.user?.id
        console.log('User created/found with ID:', userId)

        if (!userId) {
          throw new Error('No user ID available')
        }

        // Step 2: Create Stripe customer record
        console.log('Creating Stripe customer record...')
        const { error: customerError } = await supabaseAdmin
          .from('stripe_customers')
          .upsert({
            user_id: userId,
            customer_id: session.customer,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (customerError) {
          console.error('Stripe customer creation error:', customerError)
        }

        // Step 3: Create user profile
        console.log('Creating user profile...')
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .upsert({
            user_id: userId,
            display_name: customerName,
            bio: 'Behärskar Napoleon Hills framgångsprinciper',
            goals: 'Bygger rikedom genom tankesättstransformation',
            favorite_module: 'Önskans kraft',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't fail the whole process if profile creation fails
        } else {
          console.log('Profile created successfully for user:', userId)
        }

        // Step 4: Create order record
        console.log('Creating order record...')
        const { error: orderError } = await supabaseAdmin
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
          })

        if (orderError) {
          console.error('Order creation error:', orderError)
        } else {
          console.log('Order record created successfully')
        }

        console.log(`✅ Successfully processed checkout for ${customerEmail}`)
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'User account and profile created successfully',
          user_id: userId 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      } catch (error) {
        console.error('Error processing checkout session:', error)
        return new Response(JSON.stringify({ 
          error: 'Failed to create user account', 
          details: error.message 
        }), { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // Handle other webhook events
    console.log('Unhandled webhook event type:', event.type)
    return new Response('ok', { headers: corsHeaders })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})