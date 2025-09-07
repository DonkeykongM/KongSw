const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, stripe-signature",
};

Deno.serve(async (req: Request) => {
  console.log('🚀 Webhook triggered with method:', req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('🔑 Environment check:', {
      hasStripeKey: !!stripeSecretKey,
      hasWebhookSecret: !!stripeWebhookSecret,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey
    });

    if (!stripeSecretKey) {
      console.error('❌ Missing STRIPE_SECRET_KEY');
      return new Response('Configuration error: Missing Stripe key', { 
        status: 500,
        headers: corsHeaders,
      });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase configuration');
      return new Response('Configuration error: Missing Supabase config', { 
        status: 500,
        headers: corsHeaders,
      });
    }

    // Create Supabase client
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get raw body for signature verification
    const body = await req.text();
    console.log('📦 Received webhook body length:', body.length);
    
    let event;
    try {
      event = JSON.parse(body);
      console.log('🎯 Webhook event type:', event.type);
      console.log('📋 Event ID:', event.id);
    } catch (parseError) {
      console.error('❌ Failed to parse webhook body:', parseError);
      return new Response('Invalid JSON payload', { 
        status: 400,
        headers: corsHeaders,
      });
    }

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('💳 Processing checkout session:', session.id);
      console.log('📧 Session metadata:', JSON.stringify(session.metadata, null, 2));

      // Extract user credentials from metadata
      const email = session.metadata?.email || session.metadata?.account_email;
      const password = session.metadata?.password || session.metadata?.account_password;

      console.log('👤 Extracted credentials:', { 
        email: email ? 'present' : 'missing', 
        password: password ? 'present' : 'missing',
        customerId: session.customer || 'none'
      });

      if (!email || !password) {
        console.error('❌ Missing email or password in session metadata');
        console.log('🔍 Full session object:', JSON.stringify(session, null, 2));
        
        // Return success to avoid retries, but log the issue
        return new Response(JSON.stringify({ 
          received: true,
          warning: 'Missing user credentials - manual account creation may be needed',
          session_id: session.id
        }), { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        console.log('🔧 Creating user account for:', email);

        // Create user account after successful payment
        const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
          email: email,
          password: password,
          email_confirm: true, // Auto-confirm email since they paid
          user_metadata: {
            created_via: 'stripe_checkout',
            stripe_customer_id: session.customer,
            stripe_session_id: session.id,
            product_purchased: 'kongmindset_course',
            purchase_date: new Date().toISOString(),
            amount_paid: session.amount_total,
            currency: session.currency,
            payment_status: 'completed',
            course_access: true,
            ai_brain_access: true,
            original_book_access: true
          }
        });

        if (signUpError) {
          console.error('⚠️  User creation error:', signUpError);
          
          // Check if user already exists
          if (signUpError.message && signUpError.message.toLowerCase().includes('already')) {
            console.log('👤 User already exists, trying to update...');
            
            // Try to find and update existing user
            const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
            
            if (listError) {
              console.error('❌ Error listing users:', listError);
            } else {
              const user = existingUsers.users.find(u => u.email === email);
              
              if (user) {
                console.log('✅ Found existing user, updating metadata...');
                const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
                  user_metadata: {
                    ...user.user_metadata,
                    stripe_customer_id: session.customer,
                    stripe_session_id: session.id,
                    product_purchased: 'kongmindset_course',
                    purchase_date: new Date().toISOString(),
                    amount_paid: session.amount_total,
                    currency: session.currency,
                    payment_status: 'completed',
                    course_access: true,
                    ai_brain_access: true,
                    original_book_access: true
                  }
                });
                
                if (updateError) {
                  console.error('❌ Error updating existing user:', updateError);
                } else {
                  console.log('✅ Successfully updated existing user');
                  authData = { user: user };
                }
              }
            }
          } else {
            // Different error, throw it
            throw signUpError;
          }
        } else {
          console.log('✅ Successfully created new user account');
        }

        // Create customer record if we have a user
        const userId = authData?.user?.id;
        console.log('💾 Creating database records for user:', userId);

        if (userId && session.customer) {
          console.log('🏪 Creating customer record...');
          
          const { error: customerError } = await supabase
            .from('stripe_customers')
            .upsert({
              user_id: userId,
              customer_id: session.customer,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });

          if (customerError) {
            console.error('⚠️  Customer record error:', customerError);
          } else {
            console.log('✅ Customer record created/updated');
          }

          // Create order record
          console.log('📋 Creating order record...');
          
          const { error: orderError } = await supabase
            .from('stripe_orders')
            .insert({
              checkout_session_id: session.id,
              payment_intent_id: session.payment_intent || 'manual_' + Date.now(),
              customer_id: session.customer,
              amount_subtotal: session.amount_subtotal || session.amount_total || 1000,
              amount_total: session.amount_total || 1000,
              currency: session.currency || 'sek',
              payment_status: 'paid',
              status: 'completed',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (orderError) {
            console.error('⚠️  Order record error:', orderError);
          } else {
            console.log('✅ Order record created');
          }
        } else {
          console.log('⚠️  Skipping database records - missing user ID or customer ID');
        }

        console.log('🎉 Payment processing completed successfully!');

      } catch (error) {
        console.error('💥 Critical error processing payment:', error);
        return new Response(JSON.stringify({ 
          error: 'Error processing payment',
          details: error.message,
          session_id: session.id
        }), { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Handle other webhook events
    else if (event.type === 'payment_intent.succeeded') {
      console.log('💰 Payment intent succeeded:', event.data.object.id);
    }
    else {
      console.log('ℹ️  Unhandled event type:', event.type);
    }

    console.log('✅ Webhook processed successfully');

    return new Response(JSON.stringify({ 
      received: true,
      event_type: event.type,
      processed_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Webhook processing error:', error);
    return new Response(JSON.stringify({
      error: 'Webhook processing failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});