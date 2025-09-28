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
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role (ADMIN POWERS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const body = await req.json()
    console.log('📦 Webhook event type:', body.type)

    // Only handle successful checkout sessions
    if (body.type === 'checkout.session.completed') {
      const session = body.data.object
      console.log('💳 Processing checkout session:', session.id)
      
      // Extract customer data from metadata
      const customerEmail = session.metadata?.email || session.customer_email
      const customerPassword = session.metadata?.password
      const customerName = session.metadata?.name || 'KongMindset Student'
      
      console.log('👤 Customer data:', { 
        email: customerEmail, 
        hasPassword: !!customerPassword,
        name: customerName 
      })

      if (!customerEmail || !customerPassword) {
        console.error('❌ Missing customer email or password in metadata')
        return new Response(
          JSON.stringify({ error: 'Missing customer data' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // STEP 1: Create auth user with ADMIN powers
      console.log('🔐 Creating auth user with admin.createUser...')
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        password: customerPassword,
        email_confirm: true, // CRITICAL: Auto-confirm so user can login immediately
        user_metadata: {
          display_name: customerName,
          full_name: customerName,
          source: 'stripe_purchase',
          stripe_customer_id: session.customer,
          stripe_session_id: session.id
        }
      })

      if (authError) {
        console.error('❌ Auth user creation failed:', authError.message)
        
        // If user already exists, get the existing user
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          console.log('👤 User already exists, fetching existing user...')
          
          const { data: existingUsers, error: fetchError } = await supabase.auth.admin.listUsers()
          
          if (!fetchError) {
            const existingUser = existingUsers.users.find(u => u.email === customerEmail)
            if (existingUser) {
              console.log('✅ Found existing user:', existingUser.id)
              
              // Update existing user's metadata and ensure email is confirmed
              const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
                email_confirm: true, // Ensure they can login
                user_metadata: {
                  ...existingUser.user_metadata,
                  stripe_customer_id: session.customer,
                  stripe_session_id: session.id,
                  last_purchase: new Date().toISOString()
                }
              })
              
              if (updateError) {
                console.error('❌ Failed to update existing user:', updateError.message)
              } else {
                console.log('✅ Updated existing user metadata')
              }
              
              // Use existing user for next steps
              var finalUserId = existingUser.id
            } else {
              console.error('❌ Could not find existing user')
              return new Response(
                JSON.stringify({ error: 'User lookup failed' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              )
            }
          } else {
            console.error('❌ Failed to fetch users:', fetchError.message)
            return new Response(
              JSON.stringify({ error: 'User fetch failed' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        } else {
          // Other auth error
          return new Response(
            JSON.stringify({ error: `Auth creation failed: ${authError.message}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      } else {
        console.log('✅ Auth user created successfully:', authUser.user.id)
        var finalUserId = authUser.user.id
      }

      // STEP 2: Create purchase record
      console.log('💰 Creating purchase record...')
      const { error: purchaseError } = await supabase
        .from('purchase_records')
        .insert([{
          user_id: finalUserId,
          stripe_customer_id: session.customer,
          stripe_session_id: session.id,
          amount_paid: session.amount_total,
          currency: session.currency?.toUpperCase() || 'SEK',
          payment_status: 'completed',
          purchased_at: new Date().toISOString()
        }])

      if (purchaseError) {
        console.error('❌ Purchase record creation failed:', purchaseError.message)
      } else {
        console.log('✅ Purchase record created')
      }

      // STEP 3: Create user profile (using user_profiles table)
      console.log('👤 Creating user profile...')
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: finalUserId,
          email: customerEmail,
          display_name: customerName,
          bio: 'Studerar Napoleon Hills framgångsprinciper',
          goals: 'Skapar rikedom genom rätt tankesätt',
          favorite_module: 'Önskans kraft',
          stripe_customer_id: session.customer,
          purchase_date: new Date().toISOString()
        }])

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError.message)
      } else {
        console.log('✅ User profile created')
      }

      console.log('🎉 Webhook processing completed successfully!')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'User created and activated',
          user_id: finalUserId,
          email: customerEmail
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // For other event types
    console.log('ℹ️ Unhandled event type:', body.type)
    return new Response(
      JSON.stringify({ message: 'Event received but not processed' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})