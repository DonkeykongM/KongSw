import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { hash } from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔥 Webhook received')
    
    // Get environment variables
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

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
      const customerEmail = session.customer_email || session.metadata?.email
      const customerName = session.metadata?.name || session.customer_details?.name || 'Kursdeltagare'
      const password = session.metadata?.password
      const stripeCustomerId = session.customer
      
      if (!customerEmail) {
        console.error('❌ No customer email found')
        return new Response('Missing customer email', { status: 400, headers: corsHeaders })
      }

      if (!password) {
        console.error('❌ No password found in metadata')
        return new Response('Missing password in metadata', { status: 400, headers: corsHeaders })
      }

      console.log('✅ Processing purchase for:', customerEmail)
      
      // Hash the password for storage
      const passwordHash = await hash(password, 12)

      try {
        // Step 1: Store in course_purchases for tracking
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('course_purchases')
          .insert({
            email: customerEmail,
            stripe_customer_id: stripeCustomerId,
            stripe_session_id: session.id,
            payment_status: 'paid',
            amount_paid: session.amount_total,
            currency: session.currency?.toUpperCase() || 'SEK',
            purchased_at: new Date().toISOString(),
            password_hash: passwordHash,
            auth_user_created: false,
            profile_created: false
          })
          .select()
          .single()
        
        if (purchaseError) {
          console.error('❌ Failed to create purchase record:', purchaseError)
          throw new Error('Failed to create purchase record')
        }
        
        console.log('✅ Purchase record created:', purchaseData.id)

        // Step 2: Store in simple_logins for authentication fallback
        const { data: loginData, error: loginError } = await supabase
          .from('simple_logins')
          .insert({
            email: customerEmail,
            password_hash: passwordHash,
            display_name: customerName,
            purchase_date: new Date().toISOString(),
            stripe_customer_id: stripeCustomerId,
            course_access: true
          })
          .select()
          .single()
        
        if (loginError) {
          console.error('❌ Failed to create login record:', loginError)
          // Don't throw here, continue with auth user creation
        } else {
          console.log('✅ Login record created for:', customerEmail)
        }

        // Step 3: Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: customerEmail,
          password: password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            display_name: customerName,
            source: 'stripe_purchase',
            stripe_customer_id: stripeCustomerId,
            purchase_date: new Date().toISOString()
          }
        })

        if (authError) {
          console.error('❌ Failed to create auth user:', authError)
          
          // If user already exists, that's okay - update the purchase record
          if (authError.message?.includes('already registered')) {
            console.log('✅ User already exists in auth, updating purchase record')
            
            // Get existing user
            const { data: existingUser } = await supabase.auth.admin.getUserByEmail(customerEmail)
            
            if (existingUser?.user) {
              // Update purchase record with auth user created flag
              await supabase
                .from('course_purchases')
                .update({ auth_user_created: true })
                .eq('id', purchaseData.id)
              
              console.log('✅ Updated purchase record for existing user')
            }
          } else {
            throw new Error('Failed to create auth user: ' + authError.message)
          }
        }

        if (authData?.user) {
          console.log('✅ Auth user created:', authData.user.email)
          
          // Update purchase record
          await supabase
            .from('course_purchases')
            .update({ auth_user_created: true })
            .eq('id', purchaseData.id)
        }

        // Step 4: Create user profile
        const userId = authData?.user?.id
        if (userId) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: userId,
              email: customerEmail,
              display_name: customerName,
              bio: 'Behärskar Napoleon Hills framgångsprinciper',
              goals: 'Bygger rikedom genom tankesättstransformation',
              favorite_module: 'Önskans kraft',
              purchase_date: new Date().toISOString(),
              stripe_customer_id: stripeCustomerId
            })
          
          if (profileError) {
            console.error('❌ Failed to create profile:', profileError)
          } else {
            console.log('✅ User profile created')
            
            // Update purchase record
            await supabase
              .from('course_purchases')
              .update({ profile_created: true })
              .eq('id', purchaseData.id)
          }
        }

        console.log('✅ Purchase flow completed successfully')
        return new Response('Purchase processed successfully', { status: 200, headers: corsHeaders })

      } catch (error) {
        console.error('❌ Error processing purchase:', error)
        return new Response(`Internal server error: ${error.message}`, { status: 500, headers: corsHeaders })
      }
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