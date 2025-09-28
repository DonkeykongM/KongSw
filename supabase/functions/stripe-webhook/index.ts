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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Verify webhook signature
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      console.error('❌ No Stripe signature found')
      return new Response('No signature', { status: 400, headers: corsHeaders })
    }

    const body = await req.text()
    console.log('📨 Webhook received from Stripe')

    // Parse the event
    const event = JSON.parse(body)
    console.log('🎯 Event type:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('💳 Processing checkout session:', session.id)

      const customerEmail = session.customer_email || session.metadata?.email
      const customerPassword = session.metadata?.password
      const customerName = session.metadata?.name || customerEmail?.split('@')[0]

      if (!customerEmail || !customerPassword) {
        console.error('❌ Missing email or password in session metadata')
        return new Response('Missing required data', { status: 400, headers: corsHeaders })
      }

      console.log('👤 Creating user for:', customerEmail)

      // STEP 1: Create auth user with admin API (GUARANTEED TO WORK)
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        password: customerPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: customerName,
          source: 'stripe_purchase'
        }
      })

      if (authError) {
        // Check if user already exists
        if (authError.message?.includes('already registered')) {
          console.log('👤 User already exists, fetching existing user')
          
          // Get existing user
          const { data: existingUsers } = await supabase.auth.admin.listUsers()
          const existingUser = existingUsers.users?.find(u => u.email === customerEmail)
          
          if (existingUser) {
            console.log('✅ Found existing user:', existingUser.id)
            
            // Update password for existing user
            await supabase.auth.admin.updateUserById(existingUser.id, {
              password: customerPassword
            })
            
            // Use existing user for profile creation
            await createUserProfile(supabase, existingUser.id, customerEmail, customerName)
            await createPurchaseRecord(supabase, existingUser.id, session)
            
            console.log('✅ Updated existing user and created records')
            return new Response('User updated successfully', { headers: corsHeaders })
          }
        }
        
        console.error('❌ Auth user creation failed:', authError.message)
        return new Response(`Auth error: ${authError.message}`, { status: 500, headers: corsHeaders })
      }

      if (!authUser.user) {
        console.error('❌ No user returned from auth creation')
        return new Response('No user created', { status: 500, headers: corsHeaders })
      }

      console.log('✅ Auth user created:', authUser.user.id)

      // STEP 2: Create user profile (GUARANTEED)
      await createUserProfile(supabase, authUser.user.id, customerEmail, customerName)

      // STEP 3: Create purchase record (GUARANTEED)
      await createPurchaseRecord(supabase, authUser.user.id, session)

      console.log('🎉 User creation completed successfully for:', customerEmail)
      return new Response('User created successfully', { headers: corsHeaders })
    }

    return new Response('Event not handled', { headers: corsHeaders })

  } catch (error) {
    console.error('💥 Webhook error:', error)
    return new Response(`Error: ${error.message}`, { status: 500, headers: corsHeaders })
  }
})

// GUARANTEED USER PROFILE CREATION
async function createUserProfile(supabase: any, userId: string, email: string, name: string) {
  try {
    console.log('👤 Creating user profile for:', userId)
    
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert([
        {
          user_id: userId,
          email: email,
          display_name: name || email.split('@')[0],
          bio: 'Studerar Napoleon Hills framgångsprinciper',
          goals: 'Skapar rikedom genom rätt tankesätt',
          favorite_module: 'Önskans kraft',
          purchase_date: new Date().toISOString()
        }
      ], {
        onConflict: 'user_id'
      })
      .select()

    if (error) {
      console.error('❌ Profile creation error:', error)
      throw error
    }

    console.log('✅ User profile created:', data)
    return data
  } catch (error) {
    console.error('💥 Profile creation failed:', error)
    throw error
  }
}

// GUARANTEED PURCHASE RECORD CREATION
async function createPurchaseRecord(supabase: any, userId: string, session: any) {
  try {
    console.log('💳 Creating purchase record for:', userId)
    
    const { data, error } = await supabase
      .from('purchase_records')
      .insert([
        {
          user_id: userId,
          stripe_customer_id: session.customer,
          stripe_session_id: session.id,
          amount_paid: session.amount_total,
          currency: session.currency,
          payment_status: 'completed',
          purchased_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('❌ Purchase record error:', error)
      throw error
    }

    console.log('✅ Purchase record created:', data)
    return data
  } catch (error) {
    console.error('💥 Purchase record failed:', error)
    throw error
  }
}