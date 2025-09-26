import { createClient } from 'npm:@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CheckoutRequest {
  email: string;
  password: string;
  name: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🛒 Checkout function called');
    
    const { email, password, name }: CheckoutRequest = await req.json();
    
    if (!email || !password || !name) {
      throw new Error('Alla fält krävs');
    }

    console.log('📧 Checkout för:', email);

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'line_items[0][price]': 'price_1S7zDfBu2e08097PaQ5APyYq',
        'line_items[0][quantity]': '1',
        'customer_email': email,
        'success_url': 'https://kongmindset.se?payment=success',
        'cancel_url': 'https://kongmindset.se?payment=cancelled',
        'metadata[user_email]': email,
        'metadata[user_password]': password,
        'metadata[user_name]': name,
        'allow_promotion_codes': 'true',
      }),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('❌ Stripe error:', errorText);
      throw new Error('Stripe checkout misslyckades');
    }

    const session = await stripeResponse.json();
    console.log('✅ Stripe session skapad:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('❌ Checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});