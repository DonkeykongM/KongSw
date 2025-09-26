import { corsHeaders } from '../_shared/cors.ts';

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing required environment variables');
}

// Import Stripe with npm: prefix for Deno
// @ts-ignore
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

// Function to generate a secure random password
function generateSecurePassword(length: number = 12): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

// Function to send email with login credentials
async function sendLoginCredentials(email: string, password: string, name: string) {
  try {
    const emailResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-login-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        name: name,
        email: email,
        password: password,
      }),
    });

    if (!emailResponse.ok) {
      console.error('Failed to send login email:', await emailResponse.text());
    } else {
      console.log('Login credentials sent successfully to:', email);
    }
  } catch (error) {
    console.error('Error sending login email:', error);
  }
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
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      return new Response('No signature provided', {
        status: 400,
        headers: corsHeaders,
      });
    }

    const body = await req.text();
    
    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response('Webhook signature verification failed', {
        status: 400,
        headers: corsHeaders,
      });
    }

    console.log('Webhook event received:', event.type);

    // Handle checkout session completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('Processing checkout session:', session.id);
      console.log('Customer email:', session.customer_email);
      console.log('Metadata:', session.metadata);

      const {
        email,
        firstName,
        lastName,
        phone,
        courseId,
        displayName
      } = session.metadata || {};

      if (!email || !firstName || !lastName || !courseId) {
        console.error('Missing required metadata in session:', session.metadata);
        return new Response('Missing required metadata', {
          status: 400,
          headers: corsHeaders,
        });
      }

      try {
        // Generate secure password for the user
        const generatedPassword = generateSecurePassword(12);
        
        console.log('Creating auth user for:', email);

        // Create auth user using Supabase Admin API
        const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
          },
          body: JSON.stringify({
            email: email,
            password: generatedPassword,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
              first_name: firstName,
              last_name: lastName,
              display_name: displayName || `${firstName} ${lastName}`,
            },
          }),
        });

        if (!authResponse.ok) {
          const errorText = await authResponse.text();
          console.error('Failed to create auth user:', errorText);
          throw new Error('Failed to create user account');
        }

        const authUser = await authResponse.json();
        console.log('Auth user created successfully:', authUser.id);

        // Create user profile
        const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'apikey': SUPABASE_SERVICE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            user_id: authUser.id,
            display_name: displayName || `${firstName} ${lastName}`,
            email: email,
            phone: phone || null,
          }),
        });

        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          console.error('Failed to create user profile:', errorText);
          // Continue anyway - user can still access course
        } else {
          console.log('User profile created successfully');
        }

        // Create purchase record
        const purchaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/purchases`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'apikey': SUPABASE_SERVICE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            user_id: authUser.id,
            course_id: courseId,
            stripe_payment_intent_id: session.payment_intent,
            amount: session.amount_total,
            currency: session.currency,
            status: 'completed',
          }),
        });

        if (!purchaseResponse.ok) {
          const errorText = await purchaseResponse.text();
          console.error('Failed to create purchase record:', errorText);
          // Continue anyway - user account is created
        } else {
          console.log('Purchase record created successfully');
        }

        // Send login credentials via email
        await sendLoginCredentials(email, generatedPassword, displayName || `${firstName} ${lastName}`);

        console.log('Webhook processing completed successfully for:', email);

      } catch (error) {
        console.error('Error processing checkout session:', error);
        return new Response('Error processing purchase', {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    return new Response('Webhook processed successfully', {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook processing failed', {
      status: 500,
      headers: corsHeaders,
    });
  }
});