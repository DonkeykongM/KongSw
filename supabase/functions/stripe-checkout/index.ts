import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, name } = await req.json()
    
    // Validate required fields
    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Password validation
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured')
    }

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[0]': 'card',
        'line_items[0][price]': 'price_1S7zDfBu2e08097PaQ5APyYq',
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${Deno.env.get('SITE_URL') || 'https://kongmindset.se'}?payment=success`,
        'cancel_url': `${Deno.env.get('SITE_URL') || 'https://kongmindset.se'}?payment=cancelled`,
        'customer_email': email,
        'metadata[email]': email,
        'metadata[password]': password,
        'metadata[name]': name,
        'metadata[source]': 'kongmindset_course_purchase'
      }),
    })

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text()
      console.error('Stripe error:', errorText)
      throw new Error(`Stripe API error: ${stripeResponse.status}`)
    }

    const session = await stripeResponse.json()
    
    console.log('✅ Checkout session created:', session.id)
    
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Checkout error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})