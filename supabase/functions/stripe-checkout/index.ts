import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🛒 Checkout request received')
    
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    
    if (!stripeSecretKey) {
      console.error('❌ Missing STRIPE_SECRET_KEY')
      return new Response('Missing Stripe configuration', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    const { email, password, name } = await req.json()
    
    console.log('📋 Checkout data:', { email, hasPassword: !!password, hasName: !!name })

    if (!email || !password || !name) {
      return new Response('Missing required fields', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Create Stripe checkout session
    const checkoutData = {
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'sek',
          product_data: {
            name: 'KongMindset - Napoleon Hills Tänk och Bli Rik Kurs',
            description: '13 interaktiva moduler + Napoleon Hill AI-mentor + GRATIS originalbok',
            images: ['https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89']
          },
          unit_amount: 29900, // 299 kr in öre
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: email,
      metadata: {
        email: email,
        password: password,
        name: name,
        source: 'kongmindset_course_purchase'
      },
      success_url: `https://kongmindset.se?payment=success`,
      cancel_url: `https://kongmindset.se?payment=cancelled`,
    }

    console.log('💳 Creating Stripe session...')

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[0]': 'card',
        'line_items[0][price_data][currency]': 'sek',
        'line_items[0][price_data][product_data][name]': 'KongMindset - Napoleon Hills Tänk och Bli Rik Kurs',
        'line_items[0][price_data][product_data][description]': '13 interaktiva moduler + Napoleon Hill AI-mentor + GRATIS originalbok',
        'line_items[0][price_data][unit_amount]': '29900',
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'customer_email': email,
        'metadata[email]': email,
        'metadata[password]': password,
        'metadata[name]': name,
        'metadata[source]': 'kongmindset_course_purchase',
        'success_url': 'https://kongmindset.se?payment=success',
        'cancel_url': 'https://kongmindset.se?payment=cancelled'
      })
    })

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text()
      console.error('❌ Stripe error:', errorText)
      return new Response(`Stripe error: ${errorText}`, { 
        status: 500,
        headers: corsHeaders 
      })
    }

    const session = await stripeResponse.json()
    console.log('✅ Stripe session created:', session.id)

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('🚨 Checkout error:', error)
    return new Response(`Checkout error: ${error.message}`, {
      status: 500,
      headers: corsHeaders
    })
  }
})