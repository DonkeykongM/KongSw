import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log(`[WEBHOOK] New request: ${req.method} ${req.url}`)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the signature from headers
    const signature = req.headers.get('stripe-signature')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    console.log(`[WEBHOOK] Signature present: ${!!signature}`)
    console.log(`[WEBHOOK] Webhook secret configured: ${!!webhookSecret}`)
    
    if (!signature || !webhookSecret) {
      console.error('[WEBHOOK] Missing signature or webhook secret')
      return new Response('Missing signature or webhook secret', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Get the request body
    const body = await req.text()
    console.log(`[WEBHOOK] Body length: ${body.length}`)

    // Verify the webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log(`[WEBHOOK] Event verified: ${event.type}`)
    } catch (err) {
      console.error(`[WEBHOOK] Webhook signature verification failed: ${err.message}`)
      return new Response(`Webhook signature verification failed: ${err.message}`, { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Handle the event
    console.log(`[WEBHOOK] Processing event: ${event.type}`)
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log(`[WEBHOOK] Checkout completed for session: ${session.id}`)
      console.log(`[WEBHOOK] Customer email: ${session.customer_details?.email}`)
      console.log(`[WEBHOOK] Metadata:`, session.metadata)

      // Extract user information from metadata
      const userEmail = session.customer_details?.email || session.metadata?.email
      const userPassword = session.metadata?.password
      const userName = session.metadata?.name || session.customer_details?.name || userEmail?.split('@')[0]

      console.log(`[WEBHOOK] Extracted email: ${userEmail}`)
      console.log(`[WEBHOOK] Password present: ${!!userPassword}`)
      console.log(`[WEBHOOK] Name: ${userName}`)

      if (!userEmail || !userPassword) {
        console.error('[WEBHOOK] Missing email or password in session metadata')
        return new Response('Missing user credentials in session', { 
          status: 400,
          headers: corsHeaders 
        })
      }

      // Check if user already exists
      console.log(`[WEBHOOK] Checking if user exists: ${userEmail}`)
      const { data: existingUser, error: userCheckError } = await supabase.auth.admin.getUserByEmail(userEmail)
      
      if (userCheckError && userCheckError.message !== 'User not found') {
        console.error(`[WEBHOOK] Error checking existing user: ${userCheckError.message}`)
        return new Response(`Error checking user: ${userCheckError.message}`, { 
          status: 500,
          headers: corsHeaders 
        })
      }

      if (existingUser?.user) {
        console.log(`[WEBHOOK] User already exists: ${userEmail}`)
        // User exists, just log the successful payment
        console.log('[WEBHOOK] Payment recorded for existing user')
      } else {
        // Create new user account
        console.log(`[WEBHOOK] Creating new user account for: ${userEmail}`)
        
        const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
          email: userEmail,
          password: userPassword,
          email_confirm: true, // Skip email confirmation
          user_metadata: {
            name: userName,
            created_via: 'stripe_payment',
            payment_session: session.id
          }
        })

        if (createUserError) {
          console.error(`[WEBHOOK] Error creating user: ${createUserError.message}`)
          return new Response(`Error creating user: ${createUserError.message}`, { 
            status: 500,
            headers: corsHeaders 
          })
        }

        console.log(`[WEBHOOK] User created successfully: ${newUser.user?.id}`)

        // Create user profile
        if (newUser.user) {
          console.log(`[WEBHOOK] Creating profile for user: ${newUser.user.id}`)
          
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([{
              user_id: newUser.user.id,
              display_name: userName || userEmail.split('@')[0] || 'Användare',
              bio: 'Behärskar Napoleon Hills framgångsprinciper',
              goals: 'Bygger rikedom genom tankesättstransformation',
              favorite_module: 'Önskans kraft'
            }])

          if (profileError) {
            console.error(`[WEBHOOK] Error creating profile: ${profileError.message}`)
            // Don't fail the webhook for profile creation errors
          } else {
            console.log(`[WEBHOOK] Profile created successfully`)
          }

          // Create user profile automatically
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                user_id: newUser.user!.id,
                display_name: userEmail.split('@')[0] || 'Användare',
                bio: 'Behärskar Napoleon Hills framgångsprinciper',
                goals: 'Bygger rikedom genom tankesättstransformation',
                favorite_module: 'Önskans kraft'
              }
            ]);

          if (profileError) {
            console.error('Error creating user profile:', profileError);
            // Don't throw error - profile can be created later
          } else {
            console.log('✅ User profile created successfully for user:', newUser.user?.id);
          }
        }
      }

      // Record the payment in stripe_customers and stripe_orders
      if (session.customer) {
        console.log(`[WEBHOOK] Recording customer and order information`)
        
        // Get or create customer record
        const { data: customer, error: customerError } = await supabase
          .from('stripe_customers')
          .upsert([{
            user_id: existingUser?.user?.id || newUser?.user?.id,
            customer_id: session.customer as string,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }], {
            onConflict: 'customer_id',
            ignoreDuplicates: false
          })

        if (customerError) {
          console.error(`[WEBHOOK] Error recording customer: ${customerError.message}`)
        }

        // Record the order
        const { error: orderError } = await supabase
          .from('stripe_orders')
          .insert([{
            checkout_session_id: session.id,
            payment_intent_id: session.payment_intent as string,
            customer_id: session.customer as string,
            amount_subtotal: session.amount_subtotal || 0,
            amount_total: session.amount_total || 0,
            currency: session.currency || 'sek',
            payment_status: session.payment_status || 'paid',
            status: 'completed',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])

        if (orderError) {
          console.error(`[WEBHOOK] Error recording order: ${orderError.message}`)
        } else {
          console.log(`[WEBHOOK] Order recorded successfully`)
        }
      }

      console.log(`[WEBHOOK] Checkout processing completed successfully`)
      return new Response('Checkout processed successfully', { 
        status: 200,
        headers: corsHeaders 
      })
    }

    // Handle other event types
    console.log(`[WEBHOOK] Unhandled event type: ${event.type}`)
    return new Response('Event type not handled', { 
      status: 200,
      headers: corsHeaders 
    })

  } catch (error) {
    console.error(`[WEBHOOK] Webhook error: ${error.message}`)
    console.error(`[WEBHOOK] Stack trace: ${error.stack}`)
    
    return new Response(`Webhook error: ${error.message}`, { 
      status: 500,
      headers: corsHeaders 
    })
  }
})