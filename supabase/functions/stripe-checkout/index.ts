import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const stripe = (await import('https://esm.sh/stripe@14.21.0')).default(
  Deno.env.get('STRIPE_SECRET_KEY') || '',
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🛒 Creating checkout session...')
    
    const { email, password, name, priceId, success_url, cancel_url } = await req.json()
    
    if (!email || !password || !priceId) {
      console.error('❌ Missing required data:', { email: !!email, password: !!password, priceId: !!priceId })
      return new Response('Missing required fields', { status: 400, headers: corsHeaders })
    }

    console.log('📧 Creating checkout for:', email)
    console.log('💰 Price ID:', priceId)

    // Create Stripe checkout session with COMPLETE metadata
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: success_url,
      cancel_url: cancel_url,
      // CRITICAL: Pass user creation data to webhook
      metadata: {
        email: email,
        password: password,
        name: name || email.split('@')[0],
        source: 'kongmindset_purchase',
        created_at: new Date().toISOString()
      },
      // Additional settings for better UX
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: false
      }
    })

    console.log('✅ Checkout session created:', session.id)
    console.log('🔗 Redirect URL:', session.url)

    return new Response(JSON.stringify({ 
      url: session.url,
      session_id: session.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('🚨 Checkout creation error:', error)
    return new Response(`Error creating checkout session: ${error.message}`, { 
      status: 500,
      headers: corsHeaders 
    })
  }
})