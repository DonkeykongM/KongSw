import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'
import Stripe from 'https://esm.sh/stripe@10.12.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Initialize Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Generate secure password
function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🎯 Webhook received from Stripe')
    
    const signature = req.headers.get('stripe-signature')
    const body = await req.text()

    let event
    try {
      // Verify webhook signature
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')
      if (webhookSecret && signature) {
        event = await stripe.webhooks.constructEventAsync(
          body,
          signature,
          webhookSecret
        )
        console.log('✅ Webhook signature verified')
      } else {
        // For testing, parse body directly
        event = JSON.parse(body)
        console.log('⚠️ Webhook signature not verified (testing mode)')
      }
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return new Response(`Webhook Error: ${err.message}`, { 
        status: 400,
        headers: corsHeaders 
      })
    }

    console.log('📨 Event type:', event.type)

    // Handle checkout session completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const customerEmail = session.customer_details?.email || session.customer_email || session.metadata?.email
      const customerName = session.customer_details?.name || session.metadata?.name || 'Kursdeltagare'
      const customerId = session.customer
      const sessionId = session.id
      const amountTotal = session.amount_total
      const currency = session.currency
      const userPassword = session.metadata?.password || generateSecurePassword()

      if (!customerEmail) {
        console.error('❌ No customer email found in checkout session')
        return new Response('Error: Customer email is missing', { 
          status: 400,
          headers: corsHeaders 
        })
      }

      console.log(`🛒 Processing purchase for: ${customerEmail}`)

      try {
        // 1. First, save purchase record
        const { data: purchaseData, error: purchaseError } = await supabaseAdmin
          .from('course_purchases')
          .insert({
            email: customerEmail,
            stripe_customer_id: customerId,
            stripe_session_id: sessionId,
            payment_status: 'paid',
            amount_paid: amountTotal,
            currency: currency,
            purchased_at: new Date().toISOString(),
            auth_user_created: false,
            profile_created: false,
            password_hash: userPassword // Store temporarily for user creation
          })
          .select()
          .single()

        if (purchaseError) {
          console.error('❌ Failed to save purchase:', purchaseError)
          throw purchaseError
        }

        console.log('✅ Purchase record saved:', purchaseData.id)

        // 2. Create user in simple_logins table (for immediate access)
        const { data: simpleLoginData, error: simpleLoginError } = await supabaseAdmin
          .from('simple_logins')
          .insert({
            email: customerEmail,
            password_hash: userPassword, // In real app, this should be hashed
            display_name: customerName,
            stripe_customer_id: customerId,
            course_access: true,
            purchase_date: new Date().toISOString()
          })
          .select()
          .single()

        if (simpleLoginError) {
          if (simpleLoginError.message.includes('duplicate key')) {
            console.log('⚠️ User already exists in simple_logins, updating...')
            // Update existing user
            const { error: updateError } = await supabaseAdmin
              .from('simple_logins')
              .update({
                stripe_customer_id: customerId,
                course_access: true,
                purchase_date: new Date().toISOString()
              })
              .eq('email', customerEmail)
            
            if (updateError) {
              console.error('❌ Failed to update existing user:', updateError)
            } else {
              console.log('✅ Updated existing user in simple_logins')
            }
          } else {
            console.error('❌ Failed to create simple_login:', simpleLoginError)
            throw simpleLoginError
          }
        } else {
          console.log('✅ User created in simple_logins:', simpleLoginData.id)
        }

        // 3. Try to create user in Supabase Auth
        try {
          const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
            email: customerEmail,
            password: userPassword,
            email_confirm: true,
            user_metadata: {
              name: customerName,
              course_access: true,
              purchase_date: new Date().toISOString(),
              stripe_customer_id: customerId,
              source: 'stripe_webhook'
            }
          })

          if (userError) {
            if (userError.message.includes('User already registered')) {
              console.log('⚠️ User already exists in auth.users')
              // Get existing user ID
              const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(customerEmail)
              if (existingUser?.user?.id) {
                console.log('✅ Found existing auth user:', existingUser.user.id)
                
                // Update purchase record with user_id
                await supabaseAdmin
                  .from('course_purchases')
                  .update({ 
                    user_id: existingUser.user.id,
                    auth_user_created: true 
                  })
                  .eq('id', purchaseData.id)
              }
            } else {
              console.error('❌ Auth user creation failed:', userError.message)
              // Don't throw - user can still access via simple_logins
            }
          } else if (userData.user) {
            console.log('✅ Auth user created successfully:', userData.user.id)
            
            // Update purchase record with user_id
            await supabaseAdmin
              .from('course_purchases')
              .update({ 
                user_id: userData.user.id,
                auth_user_created: true 
              })
              .eq('id', purchaseData.id)

            // 4. Create user profile
            const { error: profileError } = await supabaseAdmin
              .from('user_profiles')
              .insert({
                user_id: userData.user.id,
                email: customerEmail,
                display_name: customerName,
                bio: 'Studerar Napoleon Hills framgångsprinciper',
                goals: 'Skapar rikedom genom rätt tankesätt',
                favorite_module: 'Önskans kraft',
                purchase_date: new Date().toISOString(),
                stripe_customer_id: customerId
              })

            if (profileError) {
              console.error('❌ Profile creation failed:', profileError)
            } else {
              console.log('✅ User profile created')
              
              // Update purchase record
              await supabaseAdmin
                .from('course_purchases')
                .update({ profile_created: true })
                .eq('id', purchaseData.id)
            }
          }
        } catch (authError) {
          console.error('❌ Auth creation error:', authError)
          // Continue - user can still access via simple_logins
        }

        // 5. Send welcome email with login credentials
        try {
          const { error: emailError } = await supabaseAdmin.functions.invoke('send-login-email', {
            body: {
              email: customerEmail,
              name: customerName,
              password: userPassword,
              loginUrl: 'https://kongmindset.com'
            }
          })

          if (emailError) {
            console.error('❌ Failed to send welcome email:', emailError)
          } else {
            console.log('✅ Welcome email sent')
          }
        } catch (emailErr) {
          console.error('❌ Email sending error:', emailErr)
          // Don't fail the webhook for email issues
        }

        console.log('🎉 Webhook processing completed successfully')
        
        return new Response(
          JSON.stringify({ 
            received: true, 
            user_created: true,
            email: customerEmail,
            message: 'User account created and course access granted'
          }), 
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )

      } catch (error) {
        console.error('❌ Error processing checkout session:', error.message)
        console.error('Error details:', error)
        
        return new Response(
          JSON.stringify({ 
            error: error.message,
            received: true,
            processed: false
          }), 
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Handle other event types
    console.log(`ℹ️ Unhandled event type: ${event.type}`)
    return new Response(
      JSON.stringify({ received: true, processed: false }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (err) {
    console.error('❌ Webhook processing error:', err.message)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})