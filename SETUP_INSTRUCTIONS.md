# Complete Setup Instructions

## 1. Supabase Project Setup

### Step 1: Create New Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: Course Purchase System
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
5. Wait for project to be created (2-3 minutes)

### Step 2: Get Project Credentials
1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

### Step 3: Configure Environment Variables
1. Create `.env` file in project root:
```bash
cp .env.example .env
```

2. Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 4: Run Database Migrations
1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy and paste the content from `supabase/migrations/001_initial_schema.sql`
4. Click **Run** to create tables and policies
5. Repeat for `supabase/migrations/002_sample_data.sql`

## 2. Stripe Integration Setup

### Step 1: Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create account
2. Complete account verification
3. Go to **Dashboard** → **Developers** → **API keys**
4. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

### Step 2: Create Product and Price
1. Go to **Products** → **Add Product**
2. Enter product details:
   - **Name**: Napoleon Hill Success Course
   - **Description**: Complete 13-module transformation program
3. Add pricing:
   - **Price**: $97.00
   - **Billing**: One-time
4. Copy the **Price ID** (starts with `price_`)

### Step 3: Update Course Data
1. In Supabase, go to **Table Editor** → **courses**
2. Edit the sample course record
3. Update `stripe_price_id` with your actual Price ID from Stripe

### Step 4: Configure Webhook
1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Enter endpoint URL: `https://your-project-id.supabase.co/functions/v1/stripe-webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copy the **Webhook Secret** (starts with `whsec_`)

### Step 5: Set Supabase Environment Variables
1. Go to **Edge Functions** in Supabase dashboard
2. Click **Environment Variables**
3. Add the following variables:
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 3. Deploy Edge Functions

### Option A: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Deploy functions
supabase functions deploy create-checkout --project-ref your-project-id
supabase functions deploy stripe-webhook --project-ref your-project-id
supabase functions deploy send-login-email --project-ref your-project-id
```

### Option B: Manual Deployment
1. Go to **Edge Functions** in Supabase dashboard
2. Click **Create Function**
3. Name: `create-checkout`
4. Copy code from `supabase/functions/create-checkout/index.ts`
5. Repeat for `stripe-webhook` and `send-login-email`

## 4. Email Configuration (Optional)

### Option A: SMTP Integration
Add these environment variables to Supabase:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourcompany.com
```

### Option B: Third-party Email Service
Integrate with services like:
- **SendGrid**: Add API key to environment variables
- **Mailgun**: Configure domain and API key
- **AWS SES**: Set up AWS credentials

## 5. Authentication Configuration

### Step 1: Configure Auth Settings
1. Go to **Authentication** → **Settings**
2. **Site URL**: Set to your domain (e.g., `https://yoursite.com`)
3. **Redirect URLs**: Add your domain for password reset
4. **Email Templates**: Customize if needed

### Step 2: Enable Email Providers
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates if desired

## 6. Testing the Complete Flow

### Step 1: Test Purchase Flow
1. Run `npm run dev` to start development server
2. Navigate to purchase page
3. Fill in customer details
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete checkout process

### Step 2: Verify Database Records
After successful purchase, check these tables in Supabase:
1. **auth.users** - New user should be created
2. **user_profiles** - Profile should be created automatically  
3. **purchases** - Purchase record should exist with status 'completed'

### Step 3: Test Login
1. Use the generated credentials to log in
2. Verify course access in dashboard
3. Test password reset functionality

## 7. Production Deployment

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to your preferred hosting service:
   - **Netlify**: Connect GitHub repo for automatic deployments
   - **Vercel**: Import project and deploy
   - **Traditional hosting**: Upload `dist` folder

### Backend Configuration
1. Update environment variables for production
2. Use live Stripe keys instead of test keys
3. Configure production email service
4. Set up monitoring and error tracking

## 8. Security Considerations

### Database Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Sensitive operations handled server-side

### Payment Security
- ✅ Payment processing handled by Stripe (PCI compliant)
- ✅ No credit card data stored in your database
- ✅ Webhook signature verification

### User Data Protection
- ✅ Passwords securely hashed by Supabase Auth
- ✅ Email credentials sent via secure channels
- ✅ Personal data encrypted in transit and at rest

## 9. Troubleshooting

### Common Issues

**Problem**: Webhook not triggering
- Check webhook URL in Stripe dashboard
- Verify environment variables in Supabase
- Check Edge Function logs for errors

**Problem**: User not created after payment
- Check webhook signature verification
- Verify Stripe event types are configured
- Check Supabase service role key permissions

**Problem**: Email not sending
- Verify SMTP configuration
- Check email service API keys
- Review send-login-email function logs

**Problem**: Users can't access course
- Check RLS policies on purchases table
- Verify purchase record was created
- Ensure course_id matches in database

### Debugging Tools

1. **Supabase Dashboard**:
   - Table Editor: View database records
   - Auth: Check user accounts
   - Edge Functions: View function logs

2. **Stripe Dashboard**:
   - Webhooks: Check delivery status
   - Events: View webhook event details
   - Logs: Monitor payment processing

## 10. Support and Maintenance

### Regular Tasks
- Monitor webhook delivery success rates
- Review Edge Function error logs
- Update dependencies and security patches
- Backup database regularly

### Monitoring
- Set up alerts for failed webhooks
- Monitor user registration success rates
- Track course completion metrics
- Monitor email delivery rates

For additional support, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Integration Guide](https://stripe.com/docs/payments/checkout)
- [React Authentication Best Practices](https://react.dev/learn/escape-hatches)