/*
  # Create user account for bahkostudi@gmail.com
  
  1. New User
    - Create auth user for bahkostudi@gmail.com
    - Create user profile with Swedish defaults
    - Link to Stripe customer if exists
  
  2. Security  
    - User can access their own data via RLS policies
    - Profile created with Swedish default values
*/

-- Create the auth user manually
-- Note: This should typically be done through the webhook, but we're doing it manually for this user
-- You'll need to run this through Supabase's Auth Admin API or directly in the database

-- First, let's create a user profile for the user ID that should exist
-- We'll use a placeholder user_id that you'll need to replace with the actual auth.users id

-- Check if user exists in auth.users (you'll need to get the actual user_id)
-- For now, let's create the profile assuming the user exists

-- Insert user profile for bahkostudi@gmail.com
-- Replace 'USER_ID_PLACEHOLDER' with the actual user_id from auth.users table
INSERT INTO user_profiles (
  user_id,
  display_name,
  bio,
  goals,
  favorite_module,
  created_at,
  updated_at
) VALUES (
  'USER_ID_PLACEHOLDER'::uuid, -- Replace with actual user_id
  'bahkostudi',
  'Behärskar Napoleon Hills framgångsprinciper',
  'Bygger rikedom genom tankesättstransformation', 
  'Önskans kraft',
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  updated_at = now();

-- If there's a stripe customer, link it
-- This assumes you have the stripe customer_id from the payment
INSERT INTO stripe_customers (
  user_id,
  customer_id,
  created_at,
  updated_at
) VALUES (
  'USER_ID_PLACEHOLDER'::uuid, -- Replace with actual user_id
  'STRIPE_CUSTOMER_ID_PLACEHOLDER', -- Replace with actual stripe customer_id
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  updated_at = now();