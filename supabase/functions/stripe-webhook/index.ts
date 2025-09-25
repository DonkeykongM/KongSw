import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('No signature', { status: 400 })
    }

    const body = await req.text()
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })
    console.log('Webhook event received:', event.type, event.id)
    

    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Processing webhook event:', event.type)

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Processing checkout session:', session.id)
      console.log('Customer email:', session.customer_details?.email)
      console.log('Metadata:', session.metadata)
      
      // Extract user credentials from metadata with better error handling
      const email = session.metadata?.email || session.customer_details?.email
      const password = session.metadata?.password

      if (session.payment_status === 'paid') {
        // Get customer details including metadata with password
        const customer = await stripe.customers.retrieve(session.customer as string)
        
        const customerEmail = session.customer_details?.email
        const tempPassword = (customer as any).metadata?.temp_password
        
        console.log('Creating account for:', customerEmail)
        console.log('Has temp password:', !!tempPassword)

        if (customerEmail && tempPassword) {
          try {
            // Create Supabase user account
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
              email: customerEmail,
              password: tempPassword,
              email_confirm: true, // Auto-confirm email
              user_metadata: {
                created_via: 'stripe_checkout',
                stripe_customer_id: session.customer
              }
            })

            if (authError) {
              console.error('Error creating user account:', authError)
              // Continue processing even if account creation fails
            } else {
              console.log('User account created successfully:', authData.user.id)
              
              // Create user profile
              const { error: profileError } = await supabaseAdmin
                .from('user_profiles')
                .insert([{
                  user_id: authData.user.id,
                  display_name: customerEmail.split('@')[0],
                  bio: 'Behärskar Napoleon Hills framgångsprinciper',
                  goals: 'Bygger rikedom genom tankesättstransformation',
                  favorite_module: 'Önskans kraft'
                }])

              if (profileError) {
                console.error('Error creating user profile:', profileError)
              } else {
                console.log('User profile created successfully')
              }

              // Create stripe customer record
              const { error: customerError } = await supabaseAdmin
                .from('stripe_customers')
                .insert([{
                  user_id: authData.user.id,
                  customer_id: session.customer as string
                }])

              if (customerError) {
                console.error('Error creating customer record:', customerError)
              }

              // Clean up temporary password from Stripe metadata
              await stripe.customers.update(session.customer as string, {
                metadata: {
                  temp_password: null,
                  account_created: 'true',
                  user_id: authData.user.id
                }
              })
            }

          } catch (error) {
            console.error('Account creation process failed:', error)
          }
        }

        // Store order information
        try {
          const { error: orderError } = await supabaseAdmin
            .from('stripe_orders')
            .insert([{
              checkout_session_id: session.id,
              payment_intent_id: session.payment_intent as string,
              customer_id: session.customer as string,
              amount_subtotal: session.amount_subtotal || 0,
              amount_total: session.amount_total || 0,
              currency: session.currency || 'sek',
              payment_status: session.payment_status,
              status: 'completed'
            }])

          if (orderError) {
            console.error('Error storing order:', orderError)
          } else {
            console.log('Order stored successfully')
          }
        } catch (error) {
          console.error('Order storage failed:', error)
        }

        console.error('No email found in session:', session.id)
        // Send notification to Make.com webhook
        try {
          const webhookPayload = {
            event_type: 'course_purchased',
        console.error('No password found in metadata for session:', session.id)
            customer_email: customerEmail,
            customer_name: session.customer_details?.name || customerEmail?.split('@')[0] || 'Unknown',
            amount: session.amount_total ? (session.amount_total / 100) : 0,
      console.log('Attempting to create account for:', email)
      
            currency: session.currency?.toUpperCase() || 'SEK',
            payment_status: session.payment_status,
            stripe_session_id: session.id,
            purchase_date: new Date().toISOString(),
            product_name: 'KongMindset Course - Think and Grow Rich',
        user_metadata: {
          created_via: 'stripe_checkout',
          stripe_customer_id: session.customer,
          stripe_session_id: session.id,
          display_name: email.split('@')[0]
        }
            special_price: session.amount_total === 29900, // 299 kr in öre
            stripe_customer_id: session.customer,
            source: 'stripe_webhook',
        console.error('Failed to create user account:', authError)
        
        // If user already exists, that's OK - they might have signed up manually first
        if (authError.message?.includes('already_registered') || authError.message?.includes('already exists')) {
          console.log('User already exists, proceeding with customer creation')
          // Try to get the existing user
          const { data: existingUser } = await supabase.auth.admin.getUserByEmail(email)
          if (existingUser?.user) {
            console.log('Found existing user:', existingUser.user.id)
            // Continue with customer record creation below
          } else {
            return new Response('User exists but could not retrieve', { status: 500, headers: corsHeaders })
          }
        } else {
          return new Response(`Failed to create user: ${authError.message}`, { status: 500, headers: corsHeaders })
        }
      } else {
        console.log('Successfully created user account:', authData.user.id)

          console.log('Sending webhook notification to Make.com')
          
      const userId = authData?.user?.id || (await supabase.auth.admin.getUserByEmail(email)).data?.user?.id
      
      if (!userId) {
        console.error('Could not get user ID for email:', email)
        return new Response('Could not get user ID', { status: 500, headers: corsHeaders })
      }
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
        .upsert([{
          })

          if (webhookResponse.ok) {
            console.log('Webhook notification sent successfully')
        }], {
          onConflict: 'user_id'
        })
            console.error('Webhook notification failed:', webhookResponse.status)
          }
        } catch (webhookError) {
        // Don't fail the webhook if customer record fails, user account is more important
        console.log('Warning: Customer record creation failed but user account exists')
      } else {
        console.log('Successfully created customer record for user:', userId)
          // Don't fail the whole process if webhook fails
        }
      // Create user profile with default values
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert([{
          user_id: userId,
          display_name: email.split('@')[0],
          bio: 'Behärskar Napoleon Hills framgångsprinciper',
          goals: 'Bygger rikedom genom tankesättstransformation',
          favorite_module: 'Önskans kraft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }], {
          onConflict: 'user_id'
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't fail webhook for profile creation error
        console.log('Warning: Profile creation failed but user account exists')
      } else {
        console.log('Successfully created user profile for:', userId)
      }

      console.log('Webhook processing completed successfully for:', email)
      }
    }

    console.log('Webhook event type not handled:', event.type)
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})