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
    
    console.log('🛒 Skapar checkout för:', email)
    
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email och lösenord krävs' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Stripe setup
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('❌ STRIPE_SECRET_KEY saknas')
      return new Response(
        JSON.stringify({ error: 'Stripe not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Skapa Stripe checkout session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'line_items[0][price]': 'price_1S7zDfBu2e08097PaQ5APyYq', // Din price ID
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${req.headers.get('origin')}?payment=success`,
        'cancel_url': `${req.headers.get('origin')}?payment=cancelled`,
        'customer_email': email,
        'metadata[email]': email,
        'metadata[password]': password,
        'metadata[name]': name || email.split('@')[0],
        'allow_promotion_codes': 'true'
      }).toString()
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Stripe fel:', response.status, errorText)
      return new Response(
        JSON.stringify({ error: 'Payment setup failed' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const session = await response.json()
    console.log('✅ Checkout session skapad:', session.id)

    return new Response(
      JSON.stringify({ url: session.url }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('💥 Checkout fel:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})