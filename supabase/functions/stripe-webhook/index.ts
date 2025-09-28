import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'
import Stripe from 'https://esm.sh/stripe@10.12.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Initialize Stripe with secret key
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🎯 Webhook received from Stripe')
    
    // Get the signature from headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      console.error('❌ No Stripe signature found')
      return new Response('No signature', { status: 400, headers: corsHeaders })
    }

    // Get the raw body
    const body = await req.text()
    console.log('📦 Webhook body length:', body.length)

    // Verify the webhook signature with the CORRECT secret
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET not configured')
      return new Response('Webhook secret not configured', { status: 500, headers: corsHeaders })
    }

    console.log('🔐 Using webhook secret:', webhookSecret.substring(0, 10) + '...')

    let event
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      )
      console.log('✅ Webhook signature verified successfully')
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return new Response(`Webhook signature verification failed: ${err.message}`, { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    console.log('📨 Processing event type:', event.type)

    // Handle successful checkout
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      console.log('💳 Processing checkout session:', session.id)

      const customerEmail = session.customer_details?.email || session.customer_email
      const customerName = session.customer_details?.name || session.metadata?.name
      const customPassword = session.metadata?.password // Password from checkout form

      if (!customerEmail) {
        console.error('❌ No customer email found in session')
        return new Response('Customer email missing', { status: 400, headers: corsHeaders })
      }

      console.log('👤 Creating user for:', customerEmail)
      console.log('📝 Customer name:', customerName)

      try {
        // STEP 1: Create user in Supabase Auth (SECURE METHOD)
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          password: customPassword || generateSecurePassword(), // Use provided password or generate secure one
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            display_name: customerName || 'Kursdeltagare',
            source: 'stripe_purchase',
            stripe_customer_id: session.customer,
            purchase_date: new Date().toISOString()
          }
        })

        if (userError) {
          if (userError.message.includes('already registered')) {
            console.log('ℹ️ User already exists, updating metadata')
            
            // User exists, just update their metadata
            const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
            const existingUser = existingUsers.users.find(u => u.email === customerEmail)
            
            if (existingUser) {
              await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                user_metadata: {
                  ...existingUser.user_metadata,
                  stripe_customer_id: session.customer,
                  purchase_date: new Date().toISOString()
                }
              })
            }
          } else {
            throw userError
          }
        } else {
          console.log('✅ User created successfully:', userData.user.id)
        }

        // STEP 2: Record the purchase
        const userId = userData?.user?.id || (await supabaseAdmin.auth.admin.listUsers()).data.users.find(u => u.email === customerEmail)?.id

        if (userId) {
          const { error: purchaseError } = await supabaseAdmin
            .from('purchase_records')
            .insert({
              user_id: userId,
              stripe_customer_id: session.customer,
              stripe_session_id: session.id,
              amount_paid: session.amount_total,
              currency: session.currency?.toUpperCase(),
              payment_status: 'completed'
            })

          if (purchaseError) {
            console.error('❌ Error recording purchase:', purchaseError)
          } else {
            console.log('✅ Purchase recorded successfully')
          }
        }

        // STEP 3: Send magic link for secure login (NO PASSWORD IN EMAIL)
        const { error: emailError } = await supabaseAdmin.auth.signInWithOtp({
          email: customerEmail,
          options: {
            emailRedirectTo: `${Deno.env.get('SITE_URL') || 'https://kongmindset.se'}?welcome=true`
          }
        })

        if (emailError) {
          console.error('❌ Error sending magic link:', emailError)
        } else {
          console.log('✅ Magic link sent to:', customerEmail)
        }

        console.log('🎉 Webhook processing completed successfully')
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      } catch (error) {
        console.error('❌ Error in webhook processing:', error.message)
        return new Response(`Server Error: ${error.message}`, { 
          status: 500, 
          headers: corsHeaders 
        })
      }
    }

    // Return success for other event types
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('❌ Webhook error:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { 
      status: 400, 
      headers: corsHeaders 
    })
  }
})

// Helper function to generate secure password
function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}