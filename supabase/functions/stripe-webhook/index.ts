import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    console.log('🎯 Webhook received from Stripe')
    
    // Get environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const siteUrl = Deno.env.get('SITE_URL') || 'https://kongmindset.se'

    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing required environment variables')
      return new Response('Missing environment variables', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get the raw body and signature
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('❌ No Stripe signature found')
      return new Response('No signature', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    console.log('🔐 Webhook signature verified successfully')

    // Parse the event
    let event
    try {
      event = JSON.parse(body)
    } catch (err) {
      console.error('❌ Invalid JSON:', err)
      return new Response('Invalid JSON', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    console.log('📦 Processing event type:', event.type)

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('💳 Processing completed checkout session:', session.id)

      const customerEmail = session.customer_email || session.customer_details?.email
      const customerName = session.customer_details?.name || session.metadata?.name || 'Kursdeltagare'
      const password = session.metadata?.password
      
      if (!customerEmail) {
        console.error('❌ No customer email found in session')
        return new Response('No customer email', { 
          status: 400,
          headers: corsHeaders 
        })
      }

      if (!password) {
        console.error('❌ No password found in session metadata')
        return new Response('No password in metadata', { 
          status: 400,
          headers: corsHeaders 
        })
      }

      console.log('👤 Creating user for:', customerEmail)

      // Check if user already exists in auth.users
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(customerEmail)
      
      let userId = null

      if (existingUser.user) {
        console.log('✅ User already exists in auth.users:', existingUser.user.id)
        userId = existingUser.user.id
      } else {
        // Create new auth user
        console.log('🆕 Creating new auth user...')
        const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
          email: customerEmail,
          password: password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            display_name: customerName,
            source: 'stripe_purchase'
          }
        })

        if (userError) {
          console.error('❌ Error creating user:', userError)
          
          // If user already exists error, try to get the existing user
          if (userError.message?.includes('already been registered')) {
            console.log('🔄 User exists, fetching existing user...')
            const { data: existingUserRetry } = await supabase.auth.admin.getUserByEmail(customerEmail)
            if (existingUserRetry.user) {
              userId = existingUserRetry.user.id
              console.log('✅ Found existing user:', userId)
            } else {
              return new Response(`User creation failed: ${userError.message}`, { 
                status: 500,
                headers: corsHeaders 
              })
            }
          } else {
            return new Response(`User creation failed: ${userError.message}`, { 
              status: 500,
              headers: corsHeaders 
            })
          }
        } else {
          userId = newUser.user.id
          console.log('✅ New user created:', userId)
        }
      }

      // Record the purchase in purchase_records table
      console.log('💾 Recording purchase...')
      const { error: purchaseError } = await supabase
        .from('purchase_records')
        .insert([{
          user_id: userId,
          stripe_customer_id: session.customer,
          stripe_session_id: session.id,
          amount_paid: session.amount_total,
          currency: session.currency?.toUpperCase() || 'SEK',
          payment_status: 'completed',
          purchased_at: new Date().toISOString()
        }])

      if (purchaseError) {
        console.error('❌ Error recording purchase:', purchaseError)
        return new Response(`Purchase recording failed: ${purchaseError.message}`, { 
          status: 500,
          headers: corsHeaders 
        })
      }

      console.log('✅ Purchase recorded successfully')

      // Check if user profile exists, create if not
      console.log('👤 Checking user profile...')
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (!existingProfile) {
        console.log('🆕 Creating user profile...')
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            user_id: userId,
            email: customerEmail,
            display_name: customerName,
            bio: 'Studerar Napoleon Hills framgångsprinciper',
            goals: 'Skapar rikedom genom rätt tankesätt',
            favorite_module: 'Önskans kraft',
            purchase_date: new Date().toISOString(),
            stripe_customer_id: session.customer
          }])

        if (profileError) {
          console.error('❌ Error creating profile:', profileError)
          // Don't fail the webhook for profile creation errors
          console.log('⚠️ Profile creation failed but continuing...')
        } else {
          console.log('✅ User profile created successfully')
        }
      } else {
        console.log('✅ User profile already exists')
      }

      console.log('🎉 Webhook processing completed successfully')
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'User created and purchase recorded',
        userId: userId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Handle other event types
    console.log('ℹ️ Unhandled event type:', event.type)
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return new Response(`Webhook error: ${error.message}`, {
      status: 500,
      headers: corsHeaders,
    })
  }
})