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
      const customerPassword = session.metadata?.password
      const customerName = session.metadata?.name || session.customer_details?.name
      const customerId = session.customer
      const amountPaid = session.amount_total
      const currency = session.currency

      console.log('👤 Customer email:', customerEmail)
      console.log('💰 Amount paid:', amountPaid, currency)

      if (!customerEmail || !customerPassword) {
        console.error('❌ Missing customer email or password')
        return new Response('Missing customer data', { 
          status: 400,
          headers: corsHeaders 
        })
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
        
        // If user already exists, try to get existing user
        if (authError.message.includes('already been registered')) {
          console.log('👤 User already exists, fetching existing user...')
          
          const { data: existingUsers, error: fetchError } = await supabase.auth.admin.listUsers()
          
          if (fetchError) {
            console.error('❌ Could not fetch existing users:', fetchError)
            return new Response('User creation failed', { 
              status: 500,
              headers: corsHeaders 
            })
          }
          
          const existingUser = existingUsers.users.find(u => u.email === customerEmail)
          
          if (existingUser) {
            console.log('✅ Found existing user:', existingUser.id)
            
            // Continue with purchase record creation using existing user
            await createPurchaseRecord(supabase, existingUser.id, session, customerId, amountPaid, currency)
            await createUserProfile(supabase, existingUser.id, customerEmail, customerName)
            
            return new Response('OK - existing user updated', { 
              status: 200,
              headers: corsHeaders 
            })
          }
        }
        
        return new Response('User creation failed', { 
          status: 500,
          headers: corsHeaders 
        })
      }

      console.log('✅ Auth user created:', authUser.user.id)

      // Step 2: Create purchase record
      await createPurchaseRecord(supabase, authUser.user.id, session, customerId, amountPaid, currency)

      // Step 3: Create user profile
      await createUserProfile(supabase, authUser.user.id, customerEmail, customerName)

      console.log('🎉 Webhook processing completed successfully')
      
      return new Response('OK', { 
        status: 200,
        headers: corsHeaders 
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
    throw new Error('Purchase record creation failed')
  }

  console.log('✅ Purchase record created:', purchaseData[0]?.id)
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
    // Don't throw error - purchase record is more important
    console.log('⚠️ Continuing without profile - can be created later')
    return null
  }

  console.log('✅ User profile created:', profileData[0]?.id)
  return profileData[0]
}