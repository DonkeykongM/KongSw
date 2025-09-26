import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface WebhookPayload {
  type: string;
  data: {
    object: {
      id: string;
      object: string;
      customer: string;
      metadata?: {
        email?: string;
        password?: string;
        name?: string;
      };
      payment_status?: string;
      amount_total?: number;
      currency?: string;
      payment_intent?: string;
    };
  };
}

serve(async (req) => {
  console.log('🎯 Webhook received:', req.method, req.url);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

    console.log('📊 Environment check:', {
      supabaseUrl: supabaseUrl ? '✅ Set' : '❌ Missing',
      serviceKey: supabaseServiceKey ? '✅ Set' : '❌ Missing', 
      webhookSecret: stripeWebhookSecret ? '✅ Set' : '❌ Missing'
    });

    if (!supabaseUrl || !supabaseServiceKey || !stripeWebhookSecret) {
      console.error('❌ Missing environment variables');
      return new Response('Missing environment variables', { 
        status: 500,
        headers: corsHeaders
      });
    }

    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Verify webhook signature
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    console.log('🔍 Webhook data received:', {
      bodyLength: body.length,
      hasSignature: !!signature,
      signature: signature?.substring(0, 20) + '...'
    });

    if (!signature) {
      console.error('❌ No stripe signature found');
      return new Response('No signature', { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Parse webhook payload
    let event: WebhookPayload;
    try {
      event = JSON.parse(body);
      console.log('📨 Webhook event:', {
        type: event.type,
        objectId: event.data.object.id,
        customer: event.data.object.customer
      });
    } catch (err) {
      console.error('❌ Invalid JSON payload:', err);
      return new Response('Invalid JSON', { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata || {};

      console.log('🛒 Processing checkout completion:', {
        sessionId: session.id,
        customerId: session.customer,
        email: metadata.email,
        hasPassword: !!metadata.password,
        paymentStatus: session.payment_status
      });

      // Verify we have required metadata
      if (!metadata.email || !metadata.password) {
        console.error('❌ Missing required metadata:', { 
          hasEmail: !!metadata.email, 
          hasPassword: !!metadata.password 
        });
        return new Response('Missing metadata', { 
          status: 400,
          headers: corsHeaders
        });
      }

      try {
        // Step 1: Create auth user
        console.log('👤 Creating auth user for:', metadata.email);
        
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: metadata.email,
          password: metadata.password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            display_name: metadata.name || metadata.email.split('@')[0],
            created_via: 'stripe_webhook',
            stripe_customer_id: session.customer
          }
        });

        if (authError) {
          console.error('❌ Auth user creation failed:', authError);
          
          // Check if user already exists
          if (authError.message?.includes('already registered')) {
            console.log('👤 User already exists, getting existing user...');
            
            const { data: existingUser, error: getUserError } = await supabase.auth.admin.getUserByEmail(metadata.email);
            
            if (getUserError || !existingUser?.user) {
              console.error('❌ Failed to get existing user:', getUserError);
              throw new Error(`User exists but couldn't retrieve: ${getUserError?.message}`);
            }
            
            console.log('✅ Found existing user:', existingUser.user.id);
            
            // Use existing user
            const userId = existingUser.user.id;
            
            // Continue with stripe_customers creation
            await createStripeCustomerRecord(supabase, userId, session.customer);
            await createUserProfile(supabase, userId, metadata);
            
          } else {
            throw new Error(`Auth user creation failed: ${authError.message}`);
          }
        } else {
          console.log('✅ Auth user created successfully:', authUser.user.id);
          
          const userId = authUser.user.id;
          
          // Step 2: Create stripe_customers record (this should trigger user_profiles creation)
          await createStripeCustomerRecord(supabase, userId, session.customer);
          
          // Step 3: Create user profile directly as backup (in case trigger fails)
          await createUserProfile(supabase, userId, metadata);
        }

        // Step 4: Create order record for tracking
        await createOrderRecord(supabase, session);

        console.log('🎉 Webhook processing completed successfully');

        return new Response('Webhook processed successfully', {
          status: 200,
          headers: corsHeaders
        });

      } catch (error) {
        console.error('💥 Webhook processing error:', error);
        
        return new Response(`Webhook error: ${error.message}`, {
          status: 500,
          headers: corsHeaders
        });
      }
    }

    // Handle other events
    console.log('ℹ️ Unhandled webhook event type:', event.type);
    return new Response('Event not handled', {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('💥 General webhook error:', error);
    return new Response(`Server error: ${error.message}`, {
      status: 500,
      headers: corsHeaders
    });
  }
});

// Helper function: Create stripe_customers record
async function createStripeCustomerRecord(supabase: any, userId: string, customerId: string) {
  console.log('💳 Creating stripe_customers record...', { userId, customerId });
  
  const { data, error } = await supabase
    .from('stripe_customers')
    .upsert([
      {
        user_id: userId,
        customer_id: customerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ], { 
      onConflict: 'user_id',
      ignoreDuplicates: false 
    })
    .select();

  if (error) {
    console.error('❌ stripe_customers creation failed:', error);
    throw new Error(`Failed to create stripe customer: ${error.message}`);
  }

  console.log('✅ stripe_customers record created/updated:', data);
  return data;
}

// Helper function: Create user profile directly  
async function createUserProfile(supabase: any, userId: string, metadata: any) {
  console.log('👤 Creating user profile directly...', { userId });
  
  const displayName = metadata.name || metadata.email?.split('@')[0] || 'Användare';
  
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert([
      {
        user_id: userId,
        display_name: displayName,
        bio: 'Behärskar Napoleon Hills framgångsprinciper',
        goals: 'Bygger rikedom genom tankesättstransformation',
        favorite_module: 'Önskans kraft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ], { 
      onConflict: 'user_id',
      ignoreDuplicates: false 
    })
    .select();

  if (error) {
    console.error('❌ user_profiles creation failed:', error);
    throw new Error(`Failed to create user profile: ${error.message}`);
  }

  console.log('✅ user_profiles record created/updated:', data);
  return data;
}

// Helper function: Create order record
async function createOrderRecord(supabase: any, session: any) {
  console.log('📦 Creating order record...', { sessionId: session.id });
  
  const { data, error } = await supabase
    .from('stripe_orders')
    .insert([
      {
        checkout_session_id: session.id,
        payment_intent_id: session.payment_intent || 'unknown',
        customer_id: session.customer,
        amount_subtotal: session.amount_total || 0,
        amount_total: session.amount_total || 0,
        currency: session.currency || 'sek',
        payment_status: session.payment_status || 'paid',
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) {
    console.error('❌ Order creation failed:', error);
    // Don't throw error for order creation failure
    console.log('⚠️ Order creation failed but continuing...');
  } else {
    console.log('✅ Order record created:', data);
  }

  return data;
}