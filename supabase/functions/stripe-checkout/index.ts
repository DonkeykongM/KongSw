/*
  # Stripe Checkout Session Creation

  This function creates a Stripe checkout session with user credentials for account creation after payment.
  
  1. Creates Stripe checkout session with the priceId sent from frontend
  2. Stores user credentials in session metadata
  3. Returns checkout URL for payment
  
  Security: User credentials are stored in Stripe metadata and used after successful payment
*/

import { corsHeaders } from '../_shared/cors.ts'

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

interface CheckoutRequest {
  email: string
  password: string
  priceId: string
  success_url: string
  cancel_url: string
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const {
      email,
      password,
      priceId,
      success_url,
      cancel_url,
    }: CheckoutRequest = await req.json()

    console.log('Creating checkout session for:', { email, priceId })

    // Validate required fields
    if (!email || !password || !priceId) {
      console.error('Missing required fields:', { email: !!email, password: !!password, priceId: !!priceId })
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: email, password, and priceId are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create checkout session with dynamic priceId
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Use the priceId sent from frontend
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment
      success_url: success_url,
      cancel_url: cancel_url,
      customer_email: email,
      metadata: {
        user_email: email,
        user_password: password, // Store for account creation after payment
        course_type: 'main_course',
        source: 'kongmindset_web'
      },
      payment_intent_data: {
        metadata: {
          user_email: email,
          course_type: 'main_course'
        }
      }
    })

    console.log('Checkout session created successfully:', session.id)

    return new Response(
      JSON.stringify({ 
        url: session.url,
        session_id: session.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Stripe checkout error:', error)
    
    let errorMessage = 'Failed to create checkout session'
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message
      
      // Handle specific Stripe errors
      if (error.message.includes('No such price')) {
        errorMessage = 'Invalid price configuration. Please contact support.'
        statusCode = 400
      } else if (error.message.includes('Invalid API key')) {
        errorMessage = 'Payment system configuration error. Please contact support.'
        statusCode = 500
      }
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: statusCode, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})