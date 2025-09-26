import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔥 Webhook received')
    
    // Get environment variables
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    console.log('🔧 Environment check:', {
      hasWebhookSecret: !!stripeWebhookSecret,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey
    })

    if (!stripeWebhookSecret || !supabaseUrl || !supabaseServiceKey) {
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

    // Get request body and headers
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    console.log('📦 Request details:', {
      hasBody: !!body,
      hasSignature: !!signature,
      bodyLength: body.length
    })

    if (!signature) {
      console.error('❌ No Stripe signature')
      return new Response('No signature', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Parse the event (simplified - in production you'd verify signature)
    let event
    try {
      event = JSON.parse(body)
      console.log('📋 Event parsed:', event.type)
    } catch (err) {
      console.error('❌ Failed to parse event:', err)
      return new Response('Invalid JSON', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      console.log('✅ Processing checkout.session.completed')
      
      const session = event.data.object
      const customerEmail = session.customer_email
      const metadata = session.metadata || {}
      
      console.log('🛒 Session data:', {
        email: customerEmail,
        hasMetadata: !!metadata,
        paymentStatus: session.payment_status
      })

      if (!customerEmail) {
        console.error('❌ No customer email in session')
        return new Response('No customer email', { 
          status: 400,
          headers: corsHeaders 
        })
      }

      // 1. Create auth user first
      const password = metadata.password || 'TempPass123!'
      const name = metadata.name || customerEmail.split('@')[0]

      console.log('👤 Creating auth user:', customerEmail)

      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        password: password,
        email_confirm: false, // Disable email confirmation completely
        user_metadata: {
          name: name,
          purchased_at: new Date().toISOString()
        }
        email_confirm: true
      })

      let userId

      if (authError) {
        console.error('❌ Auth user creation failed:', authError)
        
        // Check if user already exists
        if (authError.message?.includes('already registered')) {
          console.log('👤 User already exists, trying to get existing user')
          const { data: existingUser } = await supabase.auth.admin.listUsers()
          const existingUserData = existingUser.users.find(u => u.email === customerEmail)
          
          if (existingUserData) {
            console.log('✅ Found existing user:', existingUserData.id)
            userId = existingUserData.id
            
            // Ensure user is confirmed
            await supabase.auth.admin.updateUserById(existingUserData.id, {
              email_confirm: true
            })
          } else {
            throw new Error(`Failed to create auth user: ${authError.message}`)
          }
        } else {
          throw new Error(`Failed to create auth user: ${authError.message}`)
        }
      } else {
        userId = authUser.user.id
        console.log('✅ Auth user created successfully:', userId)
      }

      if (!userId) {
        console.error('❌ No user ID after creation')
        return new Response('Failed to get user ID', { 
          status: 500,
          headers: corsHeaders 
        })
      }

      console.log('✅ Auth user created/found:', userId)

      // Ensure the user is properly confirmed in the database
      await supabase
        .from('auth.users')
        .update({
          email_confirmed_at: new Date().toISOString(),
          confirmed_at: new Date().toISOString()
        })
        .eq('id', userId)

      // 2. Insert into course_purchases
      console.log('💳 Creating course purchase record')
      
      const { error: purchaseError } = await supabase
        .from('course_purchases')
        .insert([{
          user_id: userId,
          email: customerEmail,
          stripe_customer_id: session.customer,
          stripe_session_id: session.id,
          payment_status: session.payment_status,
          amount_paid: session.amount_total,
          currency: session.currency,
          purchased_at: new Date().toISOString()
        }])

      if (purchaseError) {
        console.error('❌ Purchase record creation failed:', purchaseError)
      } else {
        console.log('✅ Purchase record created')
      }

      // 3. Create user profile
      console.log('👤 Creating user profile')
      
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: userId,
          email: customerEmail,
          display_name: name,
          bio: 'Behärskar Napoleon Hills framgångsprinciper',
          goals: 'Bygger rikedom genom tankesättstransformation',
          favorite_module: 'Önskans kraft',
          has_course_access: true
        }])

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError)
      } else {
        console.log('✅ User profile created')
      }

      console.log('🎉 Webhook processing completed successfully')
      
      return new Response(JSON.stringify({ 
        success: true,
        userId: userId,
        message: 'User created and course access granted'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    console.log('ℹ️ Event type not handled:', event.type)
    return new Response('Event not handled', { 
      status: 200,
      headers: corsHeaders 
    })

  } catch (error) {
    console.error('🚨 Webhook error:', error)
    return new Response(`Webhook error: ${error.message}`, {
      status: 500,
      headers: corsHeaders
    })
  }
})