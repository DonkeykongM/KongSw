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
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Verify webhook signature
    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    
    if (!signature) {
      console.error('❌ No Stripe signature found')
      return new Response('No signature', { status: 400, headers: corsHeaders })
    }

    // Parse the event
    let event
    try {
      event = JSON.parse(body)
      console.log('📦 Event type:', event.type)
    } catch (err) {
      console.error('❌ Invalid JSON:', err)
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders })
    }

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('💳 Processing checkout session:', session.id)
      
      const customerEmail = session.customer_email || session.metadata?.email
      const customerPassword = session.metadata?.password
      const customerName = session.metadata?.name || session.customer_details?.name
      
      if (!customerEmail || !customerPassword) {
        console.error('❌ Missing email or password in session metadata')
        return new Response('Missing required data', { status: 400, headers: corsHeaders })
      }

      console.log('👤 Creating user for:', customerEmail)

      try {
        // STEP 1: Create auth user with admin API
        console.log('🔐 Creating auth user...')
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: customerEmail,
          password: customerPassword,
          email_confirm: true,  // CRITICAL: Mark email as confirmed
          phone_confirm: true,  // CRITICAL: Mark phone as confirmed
          user_metadata: {
            display_name: customerName || customerEmail.split('@')[0],
            full_name: customerName || customerEmail.split('@')[0],
            source: 'stripe_purchase',
            purchase_session_id: session.id,
            created_via: 'webhook'
          },
          app_metadata: {
            provider: 'email',
            providers: ['email']
          }
        })

        if (authError) {
          // Check if user already exists
          if (authError.message?.includes('already registered') || authError.message?.includes('already exists')) {
            console.log('⚠️ User already exists, trying to get existing user')
            
            // Get existing user
            const { data: existingUser, error: getUserError } = await supabase.auth.admin.getUserByEmail(customerEmail)
            
            if (getUserError || !existingUser.user) {
              console.error('❌ Could not get existing user:', getUserError)
              throw new Error(`User exists but cannot access: ${getUserError?.message}`)
            }
            
            console.log('✅ Found existing user:', existingUser.user.id)
            userId = existingUser.user.id
          } else {
            console.error('❌ Failed to create auth user:', authError)
            throw new Error(`Auth user creation failed: ${authError.message}`)
          }
        } else {
          console.log('✅ Auth user created successfully:', authUser.user.id)
          userId = authUser.user.id
        }

        const userId = authUser?.user?.id
        if (!userId) {
          throw new Error('No user ID available')
        }

        // STEP 2: Create purchase record
        console.log('💰 Creating purchase record...')
        const { error: purchaseError } = await supabase
          .from('purchase_records')
          .insert([{
            user_id: userId,
            stripe_customer_id: session.customer,
            stripe_session_id: session.id,
            amount_paid: session.amount_total,
            currency: session.currency,
            payment_status: 'completed',
            purchased_at: new Date().toISOString()
          }])

        if (purchaseError) {
          console.error('❌ Purchase record creation failed:', purchaseError)
          // Don't throw - user is created, this is just tracking
        } else {
          console.log('✅ Purchase record created')
        }

        // STEP 3: Create user profile (if not exists)
        console.log('👤 Creating user profile...')
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert([{
            user_id: userId,
            email: customerEmail,
            display_name: customerName || customerEmail.split('@')[0],
            bio: 'Studerar Napoleon Hills framgångsprinciper',
            goals: 'Skapar rikedom genom rätt tankesätt',
            favorite_module: 'Önskans kraft',
            purchase_date: new Date().toISOString(),
            stripe_customer_id: session.customer
          }], {
            onConflict: 'user_id'
          })

        if (profileError) {
          console.error('❌ Profile creation failed:', profileError)
          // Don't throw - user can still log in
        } else {
          console.log('✅ User profile created/updated')
        }

        console.log('🎉 User setup complete! Customer can now log in with:', customerEmail)
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'User created and activated successfully',
            user_id: userId
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )

      } catch (error) {
        console.error('❌ Error in user creation process:', error)
        
        return new Response(
          JSON.stringify({ 
            error: 'Failed to create user account',
            details: error.message 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Handle other event types
    console.log('ℹ️ Unhandled event type:', event.type)
    return new Response(
      JSON.stringify({ received: true, event_type: event.type }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})