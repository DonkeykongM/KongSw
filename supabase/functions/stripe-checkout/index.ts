import { corsHeaders } from '../_shared/cors.ts';

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '');

interface CheckoutRequest {
  email: string;
  password: string;
  priceId: string;
  success_url: string;
  cancel_url: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, password, priceId, success_url, cancel_url }: CheckoutRequest = await req.json();

    // Validate required fields
    if (!email || !password || !priceId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, password, or priceId' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Creating checkout session with priceId:', priceId);

    // Create Stripe checkout session with the priceId from frontend
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Use the priceId sent from frontend
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      customer_email: email,
      metadata: {
        user_email: email,
        user_password: password, // Store temporarily for account creation after payment
        course_access: 'lifetime',
        purchase_type: 'founder_special'
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['SE', 'NO', 'DK', 'FI', 'DE', 'NL', 'BE', 'FR', 'GB', 'US', 'CA'],
      },
    });

    console.log('Checkout session created successfully:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create checkout session',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});