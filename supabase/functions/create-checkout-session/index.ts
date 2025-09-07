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
    const { email, successUrl, cancelUrl } = await req.json()

    // Validate required fields
    if (!email) {
      throw new Error('Email is required')
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('Stripe secret key not found in environment variables')
      throw new Error('Payment system not configured. Please contact support.')
    }

    console.log('Creating Stripe checkout session for:', email)

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[0]': 'card',
        'mode': 'payment',
        'customer_email': email,
        'success_url': successUrl || `${new URL(req.url).origin}?payment=success`,
        'cancel_url': cancelUrl || `${new URL(req.url).origin}?payment=cancelled`,
        
        // Product details - KongMindset Course
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': 'KongMindset - 2025 Campaign Access',
        'line_items[0][price_data][product_data][description]': '🧠 2025 Campaign: Full Year Access $29.99 + Napoleon Hill AI Brain + FREE Original Book',
        'line_items[0][price_data][product_data][images][0]': 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg',
        'line_items[0][price_data][unit_amount]': '2999', // $29.99
        'line_items[0][quantity]': '1',
        
        // Metadata for webhook processing
        'metadata[email]': email,
        'metadata[product_type]': 'course_access',
        'metadata[course_name]': 'kongmindset_napoleon_hill',
        'metadata[ai_brain_access]': 'true',
        'metadata[member_tier]': 'first_100',
        
        // Additional checkout options
        'allow_promotion_codes': 'true',
        'billing_address_collection': 'auto',
        'shipping_address_collection[allowed_countries][0]': 'US',
        'shipping_address_collection[allowed_countries][1]': 'CA',
        'shipping_address_collection[allowed_countries][2]': 'GB',
        'shipping_address_collection[allowed_countries][3]': 'AU',
        'shipping_address_collection[allowed_countries][4]': 'DE', // Tyskland
        'shipping_address_collection[allowed_countries][5]': 'FR', // Frankrike
        'shipping_address_collection[allowed_countries][6]': 'IT', // Italien
        'shipping_address_collection[allowed_countries][7]': 'ES', // Spanien
        'shipping_address_collection[allowed_countries][8]': 'NL', // Nederländerna
        'shipping_address_collection[allowed_countries][9]': 'BE', // Belgien
        'shipping_address_collection[allowed_countries][10]': 'AT', // Österrike
        'shipping_address_collection[allowed_countries][11]': 'PL', // Polen
        'shipping_address_collection[allowed_countries][12]': 'SE', // Sverige
        'shipping_address_collection[allowed_countries][13]': 'DK', // Danmark
        'shipping_address_collection[allowed_countries][14]': 'FI', // Finland
        'shipping_address_collection[allowed_countries][15]': 'IE', // Irland
        'shipping_address_collection[allowed_countries][16]': 'CH', // Schweiz
        'shipping_address_collection[allowed_countries][17]': 'NO', // Norge
        'shipping_address_collection[allowed_countries][18]': 'CZ', // Tjeckien
        'shipping_address_collection[allowed_countries][19]': 'PT', // Portugal
        'shipping_address_collection[allowed_countries][20]': 'HU', // Ungern
        'shipping_address_collection[allowed_countries][21]': 'SK', // Slovakien
        'shipping_address_collection[allowed_countries][22]': 'SI', // Slovenien
        'shipping_address_collection[allowed_countries][23]': 'HR', // Kroatien
        'shipping_address_collection[allowed_countries][24]': 'RO', // Rumänien
        'shipping_address_collection[allowed_countries][25]': 'BG', // Bulgarien
        'shipping_address_collection[allowed_countries][26]': 'LT', // Litauen
        'shipping_address_collection[allowed_countries][27]': 'LV', // Lettland
        'shipping_address_collection[allowed_countries][28]': 'EE', // Estland
        'shipping_address_collection[allowed_countries][29]': 'MT', // Malta
        'shipping_address_collection[allowed_countries][30]': 'CY', // Cypern
        'shipping_address_collection[allowed_countries][31]': 'LU', // Luxemburg
        'shipping_address_collection[allowed_countries][32]': 'JP', // Japan
        'shipping_address_collection[allowed_countries][33]': 'KR', // Sydkorea
        'shipping_address_collection[allowed_countries][34]': 'SG', // Singapore
        'shipping_address_collection[allowed_countries][35]': 'HK', // Hongkong
        'shipping_address_collection[allowed_countries][36]': 'NZ', // Nya Zeeland
        'shipping_address_collection[allowed_countries][37]': 'BR', // Brasilien
        'shipping_address_collection[allowed_countries][38]': 'MX', // Mexiko
        'shipping_address_collection[allowed_countries][39]': 'AR', // Argentina
        'shipping_address_collection[allowed_countries][40]': 'CL', // Chile
        'shipping_address_collection[allowed_countries][41]': 'CO', // Colombia
        'shipping_address_collection[allowed_countries][42]': 'ZA', // Sydafrika
        'shipping_address_collection[allowed_countries][43]': 'IL', // Israel
        'shipping_address_collection[allowed_countries][44]': 'AE', // Förenade Arabemiraten
        'shipping_address_collection[allowed_countries][45]': 'SA', // Saudiarabien
        'shipping_address_collection[allowed_countries][46]': 'TR', // Turkiet
        'shipping_address_collection[allowed_countries][47]': 'RU', // Ryssland
        'shipping_address_collection[allowed_countries][48]': 'UA', // Ukraina
        'shipping_address_collection[allowed_countries][49]': 'IN', // Indien
        'shipping_address_collection[allowed_countries][50]': 'TH', // Thailand
        'shipping_address_collection[allowed_countries][51]': 'MY', // Malaysia
        'shipping_address_collection[allowed_countries][52]': 'PH', // Filippinerna
        'shipping_address_collection[allowed_countries][53]': 'ID', // Indonesien
        'shipping_address_collection[allowed_countries][54]': 'VN', // Vietnam
        
        // Custom success message
        'custom_text[submit][message]': 'Securing your lifetime access to KongMindset...',
      }),
    })

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text()
      console.error('Stripe API Error:', errorText)
      throw new Error('Failed to create checkout session. Please try again.')
    }

    const session = await stripeResponse.json()

    console.log('Stripe checkout session created:', session.id)

    return new Response(
      JSON.stringify({ 
        url: session.url, 
        sessionId: session.id,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Payment initialization failed',
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})