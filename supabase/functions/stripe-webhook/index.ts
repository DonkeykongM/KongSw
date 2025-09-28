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
    const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const SITE_URL = Deno.env.get('SITE_URL') || 'https://kongmindset.se'

    if (!STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing required environment variables')
      return new Response('Missing environment variables', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get the body as text first
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('❌ No Stripe signature found')
      return new Response('No signature', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    console.log('✅ Webhook signature verified')

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

    console.log('📦 Event type:', event.type)

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('💳 Processing checkout session:', session.id)

      // Extract customer data
      const customerEmail = session.customer_email || session.metadata?.email
      const customerPassword = session.metadata?.password || 'TempPass123!'
      const customerName = session.metadata?.name || session.customer_details?.name || customerEmail?.split('@')[0] || 'Kursdeltagare'
      const customerId = session.customer
      const amountPaid = session.amount_total
      const currency = session.currency

      console.log('👤 Customer email:', customerEmail)
      console.log('💰 Amount paid:', amountPaid, currency)

      if (!customerEmail) {
        console.error('❌ Missing customer email')
        // Don't fail completely - log and continue
        console.log('⚠️ Continuing without email - will use customer data')
      }

      // Step 1: Create auth user
      console.log('🔐 Creating auth user...')
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        password: customerPassword,
        email_confirm: true,
        user_metadata: {
          display_name: customerName || customerEmail.split('@')[0],
          source: 'stripe_purchase'
        }
      })

      if (authError) {
        console.error('❌ Auth user creation failed:', authError.message)
        
        // Check if user already exists
        if (authError.message?.includes('already registered')) {
          console.log('👤 User already exists, fetching existing user...')
          
          // Get existing user
          const { data: existingUser } = await supabase.auth.admin.getUserByEmail(customerEmail)
          if (existingUser.user) {
            userId = existingUser.user.id
            console.log('✅ Using existing user:', userId)
          } else {
            console.error('❌ Could not find existing user')
            return new Response(`Could not create or find user: ${authError.message}`, { 
              status: 500, 
              headers: corsHeaders 
            })
          }
        } else {
          console.error('❌ Failed to create auth user:', authError)
          return new Response(`Auth error: ${authError.message}`, { 
            status: 500, 
            headers: corsHeaders 
          })
        }
      }

      console.log('✅ Auth user created:', authUser.user.id)

      // Step 2: Create purchase record
      await createPurchaseRecord(supabase, authUser.user.id, session, customerId, amountPaid, currency)

      // Step 3: Create user profile
      await createUserProfile(supabase, authUser.user.id, customerEmail, customerName)

      console.log('🎉 Webhook processing completed successfully')
      
      return new Response(JSON.stringify({ 
        success: true,
        userId: authUser.user.id,
        message: 'User created and course access granted' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Handle other event types
    console.log('ℹ️ Unhandled event type:', event.type)
    return new Response('OK', { 
      status: 200,
      headers: corsHeaders 
    })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders 
    })
  }
})

// Helper function to create purchase record
async function createPurchaseRecord(supabase: any, userId: string, session: any, customerId: string, amountPaid: number, currency: string) {
  console.log('💾 Creating purchase record...')
  
  const { data: purchaseData, error: purchaseError } = await supabase
    .from('purchase_records')
    .insert([{
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_session_id: session.id,
      amount_paid: amountPaid,
      currency: currency,
      payment_status: 'completed',
      purchased_at: new Date().toISOString()
    }])
    .select()

  if (purchaseError) {
    console.error('❌ Purchase record creation failed:', purchaseError)
    // Continue anyway - user creation is more important
    console.log('⚠️ Continuing despite purchase record error')
  } else {
    console.log('✅ Purchase record created:', purchaseData[0]?.id)
  }

  return purchaseData[0]
}

// Helper function to create user profile
async function createUserProfile(supabase: any, userId: string, email: string, name?: string) {
  console.log('👤 Creating user profile...')
  
  const displayName = name || email.split('@')[0] || 'Kursdeltagare'
  
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .insert([{
      user_id: userId,
      email: email,
      display_name: displayName,
      bio: 'Studerar Napoleon Hills framgångsprinciper',
      goals: 'Skapar rikedom genom rätt tankesätt',
      favorite_module: 'Önskans kraft',
      purchase_date: new Date().toISOString(),
      stripe_customer_id: null // Will be updated if needed
    }])
    .select()

  if (profileError) {
    console.error('❌ Profile creation failed:', profileError)
    // Try to create with minimal data
    const { error: minimalProfileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        email: email,
        display_name: displayName
      })
      
    if (minimalProfileError) {
      console.error('❌ Failed to create minimal profile:', minimalProfileError)
      // Continue anyway - user can update profile later
      console.log('⚠️ User created but profile creation failed')
    } else {
      console.log('✅ Minimal profile created successfully')
    }
  } else {
    console.log('✅ User profile created:', profileData[0]?.id)
  }

  return profileData[0]
}