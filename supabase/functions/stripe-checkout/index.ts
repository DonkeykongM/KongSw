import { createClient } from 'npm:@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

Deno.serve(async (req: Request) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const { email, password, name, priceId, success_url, cancel_url } = await req.json();

    // Validate required fields
    if (!email || !password || !priceId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, password, priceId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🛒 Creating checkout for:', email);

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('Missing STRIPE_SECRET_KEY');
      return new Response(
        JSON.stringify({ error: 'Payment system not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Stripe checkout session with comprehensive metadata
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'payment_method_types[0]': 'card',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'customer_email': email,
        'success_url': success_url || `${new URL(req.url).origin}?payment=success`,
        'cancel_url': cancel_url || `${new URL(req.url).origin}?payment=cancelled`,
        
        // CRITICAL: Add all user data to metadata so webhook can create account
        'metadata[email]': email,
        'metadata[password]': password,
        'metadata[name]': name || email.split('@')[0],
        'metadata[source]': 'kongmindset_course',
        'metadata[timestamp]': new Date().toISOString(),
        
        // Additional metadata for webhook processing
        'metadata[create_user]': 'true',
        'metadata[course_access]': 'lifetime',
        'metadata[platform]': 'kongmindset'
      }).toString(),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe API error:', stripeResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to create checkout session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const session = await stripeResponse.json();
    console.log('✅ Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('🚨 Checkout error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error during checkout creation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});