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

    // Parse the webhook payload
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')
    
    console.log('📦 Webhook body received, length:', body.length)
    
    // For development, we'll parse the JSON directly
    // In production, you should verify the webhook signature
    const event = JSON.parse(body)
    
    console.log('🔔 Event type:', event.type)
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('💳 Processing checkout session:', session.id)
      
      const customerEmail = session.customer_email || session.metadata?.email
      const customerPassword = session.metadata?.password
      const customerName = session.metadata?.name || session.customer_details?.name
      
      console.log('👤 Customer details:', { 
        email: customerEmail, 
        hasPassword: !!customerPassword,
        name: customerName 
      })
      
      if (!customerEmail || !customerPassword) {
        console.error('❌ Missing required customer data')
        return new Response(
          JSON.stringify({ error: 'Missing customer email or password' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // STEP 1: Create auth user with admin privileges
      console.log('🔐 Creating auth user for:', customerEmail)
      
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        password: customerPassword,
        email_confirm: true, // Skip email confirmation
        email_confirm: true,
        phone_confirm: true,
        user_metadata: {
          display_name: customerName || customerEmail.split('@')[0],
          full_name: customerName || customerEmail.split('@')[0],
          source: 'stripe_purchase',
          email_confirmed_at: new Date().toISOString(),
          confirmed_at: new Date().toISOString()
        }
      })

      if (authError) {
        console.error('❌ Auth user creation failed:', authError)
        
        // Check if user already exists
        if (authError.message?.includes('already registered')) {
          console.log('👤 User already exists, fetching existing user')
          
          // Get existing user
          const { data: existingUsers } = await supabase.auth.admin.listUsers()
          const existingUser = existingUsers.users?.find(u => u.email === customerEmail)
          
          if (existingUser) {
            console.log('✅ Found existing user:', existingUser.id)
            
            // Update existing user's password
            const { error: updateError } = await supabase.auth.admin.updateUserById(
              existingUser.id,
              { password: customerPassword }
            )
            
            if (updateError) {
              console.error('❌ Failed to update password:', updateError)
            } else {
              console.log('✅ Password updated for existing user')
            }
            
            // Use existing user for purchase record
            await createPurchaseRecord(supabase, session, existingUser.id)
            
            return new Response(
              JSON.stringify({ success: true, message: 'Purchase recorded for existing user' }),
              { 
                status: 200, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }
        }
        
        return new Response(
          JSON.stringify({ error: 'Failed to create user account' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log('✅ Auth user created successfully:', authUser.user.id)

      // STEP 2: Create purchase record
      await createPurchaseRecord(supabase, session, authUser.user.id)

      // STEP 3: Create user profile (this should happen via trigger, but let's ensure it)
      console.log('👤 Creating user profile for:', authUser.user.id)
      
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert([
          {
            user_id: authUser.user.id,
            email: customerEmail,
            display_name: customerName || customerEmail.split('@')[0],
            bio: 'Studerar Napoleon Hills framgångsprinciper',
            goals: 'Skapar rikedom genom rätt tankesätt',
            favorite_module: 'Önskans kraft',
            purchase_date: new Date().toISOString(),
            stripe_customer_id: session.customer
          }
        ])

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError)
      } else {
        console.log('✅ User profile created successfully')
      }

      console.log('🎉 Webhook processing completed successfully')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'User account and purchase processed successfully',
          user_id: authUser.user.id
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Handle other event types
    console.log('ℹ️ Unhandled event type:', event.type)
    return new Response(
      JSON.stringify({ message: 'Event received but not processed' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('💥 Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Helper function to create purchase record
async function createPurchaseRecord(supabase: any, session: any, userId: string) {
  console.log('💰 Creating purchase record for user:', userId)
  
  const { error: purchaseError } = await supabase
    .from('purchase_records')
    .insert([
      {
        user_id: userId,
        stripe_customer_id: session.customer,
        stripe_session_id: session.id,
        amount_paid: session.amount_total,
        currency: session.currency?.toUpperCase() || 'SEK',
        payment_status: 'completed',
        purchased_at: new Date().toISOString()
      }
    ])

  if (purchaseError) {
    console.error('❌ Purchase record creation failed:', purchaseError)
  } else {
    console.log('✅ Purchase record created successfully')
  }
}