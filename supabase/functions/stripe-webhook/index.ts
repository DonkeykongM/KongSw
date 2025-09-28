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
    console.log('🎯 Webhook received:', req.method)
    
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

    if (!supabaseUrl || !supabaseServiceKey || !stripeWebhookSecret) {
      console.error('❌ Missing environment variables')
      return new Response('Missing environment variables', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Parse the webhook payload
    const body = await req.text()
    let event

    try {
      event = JSON.parse(body)
      console.log('📦 Event type:', event.type)
    } catch (err) {
      console.error('❌ Invalid JSON:', err)
      return new Response('Invalid JSON', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('💳 Processing checkout session:', session.id)

      // Extract customer data
      const customerEmail = session.customer_email || session.metadata?.email
      const customerPassword = session.metadata?.password
      const customerName = session.metadata?.name || session.customer_details?.name
      const stripeCustomerId = session.customer
      const sessionId = session.id
      const amountPaid = session.amount_total
      const currency = session.currency

      console.log('👤 Customer data:', {
        email: customerEmail,
        name: customerName,
        hasPassword: !!customerPassword,
        stripeCustomerId,
        amountPaid
      })

      if (!customerEmail || !customerPassword) {
        console.error('❌ Missing required customer data')
        return new Response('Missing customer email or password', { 
          status: 400,
          headers: corsHeaders 
        })
      }

      try {
        // STEP 1: Create auth user with admin privileges
        console.log('🔐 Creating auth user for:', customerEmail)
        
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: customerEmail,
          password: customerPassword,
          email_confirm: true, // CRITICAL: Auto-confirm email
          phone_confirm: true,
          user_metadata: {
            display_name: customerName || customerEmail.split('@')[0],
            full_name: customerName || customerEmail.split('@')[0],
            source: 'stripe_purchase',
            stripe_customer_id: stripeCustomerId
          }
        })

        if (authError) {
          // Check if user already exists
          if (authError.message?.includes('already registered') || authError.message?.includes('already exists')) {
            console.log('👤 User already exists, fetching existing user')
            
            // Get existing user
            const { data: existingUsers, error: fetchError } = await supabase.auth.admin.listUsers()
            
            if (fetchError) {
              console.error('❌ Error fetching existing users:', fetchError)
              throw fetchError
            }
            
            const existingUser = existingUsers.users.find(u => u.email === customerEmail)
            
            if (!existingUser) {
              console.error('❌ User should exist but not found')
              throw new Error('User registration failed')
            }
            
            console.log('✅ Found existing user:', existingUser.id)
            
            // Use existing user for profile creation
            await createUserProfile(supabase, existingUser.id, customerEmail, customerName)
            await createPurchaseRecord(supabase, existingUser.id, stripeCustomerId, sessionId, amountPaid, currency, customerEmail)
            
          } else {
            console.error('❌ Auth user creation failed:', authError)
            throw authError
          }
        } else if (authUser?.user) {
          console.log('✅ Auth user created successfully:', authUser.user.id)
          
          // STEP 2: Create user profile
          await createUserProfile(supabase, authUser.user.id, customerEmail, customerName)
          
          // STEP 3: Create purchase record
          await createPurchaseRecord(supabase, authUser.user.id, stripeCustomerId, sessionId, amountPaid, currency, customerEmail)
        }

        console.log('🎉 Webhook processing completed successfully')
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'User account created and activated successfully' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })

      } catch (error: any) {
        console.error('❌ Error processing webhook:', error)
        
        return new Response(JSON.stringify({ 
          error: 'Failed to process webhook', 
          details: error.message 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        })
      }
    }

    // Handle other event types
    console.log('ℹ️ Unhandled event type:', event.type)
    return new Response(JSON.stringify({ message: 'Event received but not processed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error('❌ Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

// Helper function to create user profile
async function createUserProfile(supabase: any, userId: string, email: string, name?: string) {
  console.log('👤 Creating user profile for:', userId)
  
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        user_id: userId,
        email: email,
        display_name: name || email.split('@')[0],
        bio: 'Behärskar Napoleon Hills framgångsprinciper',
        goals: 'Bygger rikedom genom tankesättstransformation',
        favorite_module: 'Önskans kraft',
        stripe_customer_id: null // Will be updated if needed
      }])
      .select()
      .single()

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError)
      throw profileError
    }

    console.log('✅ User profile created:', profileData.id)
    return profileData
  } catch (error) {
    console.error('❌ Error in createUserProfile:', error)
    throw error
  }
}

// Helper function to create purchase record
async function createPurchaseRecord(
  supabase: any, 
  userId: string, 
  stripeCustomerId: string, 
  sessionId: string, 
  amountPaid: number, 
  currency: string,
  email: string
) {
  console.log('💰 Creating purchase record for:', userId)
  
  try {
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchase_records')
      .insert([{
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        stripe_session_id: sessionId,
        amount_paid: amountPaid,
        currency: currency.toUpperCase(),
        payment_status: 'completed',
        purchased_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (purchaseError) {
      console.error('❌ Purchase record creation failed:', purchaseError)
      throw purchaseError
    }

    console.log('✅ Purchase record created:', purchaseData.id)
    return purchaseData
  } catch (error) {
    console.error('❌ Error in createPurchaseRecord:', error)
    throw error
  }
}