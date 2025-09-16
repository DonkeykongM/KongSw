const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('Stripe checkout function called');
    
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { email, password, success_url, cancel_url } = requestBody;

    // Validate required fields
    if (!email || !password) {
      console.error('Missing required fields:', { email: !!email, password: !!password });
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get Stripe secret key from environment
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY environment variable not found');
      return new Response(
        JSON.stringify({ error: 'Payment system configuration error. Please contact support.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Creating Stripe checkout session...');

    // Create Stripe checkout session
    const stripeRequestBody = new URLSearchParams({
      'payment_method_types[0]': 'card',
      'mode': 'payment',
      'customer_email': email,
      'success_url': success_url || `${new URL(req.url).origin}?payment=success`,
      'cancel_url': cancel_url || `${new URL(req.url).origin}?payment=cancelled`,
      
      // Product details
      'line_items[0][price_data][currency]': 'sek',
      'line_items[0][price_data][product_data][name]': 'KongMindset - Complete Course Access',
      'line_items[0][price_data][product_data][description]': 'Komplett tillgång till Napoleon Hills Tänk och Bli Rik kurs med 13 interaktiva moduler, Napoleon Hill AI-mentor och gratis originalbok nedladdning.',
      'line_items[0][price_data][unit_amount]': '300', // 3.00 kr in öre (TEST PRICE - Stripe minimum for SEK)
      'line_items[0][quantity]': '1',
      
      // CRITICAL: Store user credentials for account creation
      'metadata[email]': email,
      'metadata[password]': password,
      'metadata[product_type]': 'course_access',
      'metadata[course_name]': 'kongmindset',
      'metadata[create_account]': 'true',
      'metadata[account_email]': email,
      'metadata[account_password]': password,
    });

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: stripeRequestBody,
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe API error:', {
        status: stripeResponse.status,
        statusText: stripeResponse.statusText,
        body: errorText
      });
      
      let errorMessage = 'Failed to create checkout session';
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      } catch {
        // If response isn't JSON, use the raw text if it's helpful
        if (errorText.length < 100) {
          errorMessage = errorText || errorMessage;
        }
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const session = await stripeResponse.json();
    console.log('Stripe checkout session created successfully:', session.id);

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in stripe-checkout function:', error);
    
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});