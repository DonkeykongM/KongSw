# Course Purchase & User Registration System

A complete solution for automatically registering users when they purchase courses, built with Supabase.

## Features

- 🛒 **Automated User Registration**: Create accounts automatically after successful payments
- 🔐 **Secure Authentication**: Login system with password reset functionality  
- 💳 **Payment Integration**: Stripe integration with webhook automation
- 📧 **Email Notifications**: Automatic login credential delivery
- 🎓 **Course Access Control**: Only paying customers can access content
- 🛡️ **Security**: Row Level Security (RLS) and proper data protection

## Architecture Overview

```
Customer Purchase Flow:
1. Customer fills purchase form (email + payment)
2. Stripe processes payment 
3. Webhook triggers user creation
4. System sends login credentials via email
5. Customer can immediately access course content
```

## Setup Instructions

### 1. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from Settings > API
3. Update the `.env` file with your credentials
4. Run the database migrations to set up tables
5. Deploy the Edge Functions

### 2. Stripe Integration

1. Create a Stripe account and get your keys
2. Set up webhook endpoint in Stripe Dashboard
3. Configure environment variables in Supabase
4. Test the payment flow

### 3. Email Configuration

1. Configure SMTP settings in Supabase
2. Customize email templates
3. Test email delivery

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

## Database Schema

See `supabase/migrations/` for complete database setup.

## Security Considerations

- All sensitive operations are handled server-side
- Passwords are securely hashed
- Payment data is handled by Stripe (PCI compliant)
- Email templates are sanitized
- RLS policies protect user data

## Support

For questions or issues, contact: support@yourcompany.com