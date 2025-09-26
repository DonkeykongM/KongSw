import { corsHeaders } from '../_shared/cors.ts';

interface CheckoutRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  courseId: string;
  successUrl: string;
  cancelUrl: string;
}

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
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
    const {
      email,
      firstName,
      lastName,
      phone,
      courseId,
      successUrl,
      cancelUrl
    }: CheckoutRequest = await req.json();

    // Validate required fields
    if (!email || !firstName || !lastName || !courseId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get course details from Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const courseResponse = await fetch(`${supabaseUrl}/rest/v1/courses?id=eq.${courseId}`, {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
      },
    });

    const courses = await courseResponse.json();
    
    if (!courses.length) {
      return new Response(
        JSON.stringify({ error: 'Course not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const course = courses[0];

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'mode': 'payment',
        'success_url': successUrl,
        'cancel_url': cancelUrl,
        'customer_email': email,
        'line_items[0][price]': course.stripe_price_id,
        'line_items[0][quantity]': '1',
        'metadata[email]': email,
        'metadata[firstName]': firstName,
        'metadata[lastName]': lastName,
        'metadata[phone]': phone || '',
        'metadata[courseId]': courseId,
        'metadata[displayName]': `${firstName} ${lastName}`,
      }),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe error:', errorText);
      throw new Error('Failed to create checkout session');
    }

    const session = await stripeResponse.json();

    return new Response(
      JSON.stringify({ checkoutUrl: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});