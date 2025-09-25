/*
  # Fix missing users from Stripe customers
  
  This migration helps identify Stripe customers who paid but don't have auth accounts yet.
  
  1. Identifies stripe customers without linked auth users
  2. Provides template for manual user creation
  3. Auto-creates user profiles once auth users exist
  
  ## Manual Steps Required:
  For each customer_id found, create auth user manually in Supabase Dashboard:
  - Go to Authentication → Users → Add User
  - Use the email from Stripe dashboard (match customer_id)
  - Set temporary password
  - ✅ Check "Email Confirm"
  - Copy the new User ID and update stripe_customers.user_id
*/

-- First, let's see which stripe customers don't have auth users
-- (This is for debugging - run this query to see missing users)

-- CREATE OR REPLACE VIEW missing_auth_users AS
-- SELECT 
--   sc.id,
--   sc.customer_id,
--   sc.created_at,
--   sc.user_id,
--   CASE 
--     WHEN sc.user_id IS NULL THEN 'NO AUTH USER - NEEDS MANUAL CREATION'
--     ELSE 'AUTH USER EXISTS'
--   END as status
-- FROM stripe_customers sc
-- WHERE sc.deleted_at IS NULL
-- ORDER BY sc.created_at DESC;

-- For bahkostudi@gmail.com specifically:
-- The newest stripe_customer (most recent created_at) should be bahkostudi@gmail.com
-- Check Stripe dashboard to confirm customer_id matches bahkostudi@gmail.com

-- After creating auth user for bahkostudi@gmail.com:
-- 1. Copy the new auth user ID
-- 2. Update the stripe_customers record:
-- UPDATE stripe_customers 
-- SET user_id = 'NEW_AUTH_USER_ID_HERE'
-- WHERE customer_id = 'BAHKOSTUDI_CUSTOMER_ID_HERE';

-- Function to auto-create user profiles when auth users are linked
CREATE OR REPLACE FUNCTION auto_create_user_profile_for_stripe_customer()
RETURNS TRIGGER AS $$
BEGIN
  -- Only run when user_id is being set (was NULL, now has value)
  IF OLD.user_id IS NULL AND NEW.user_id IS NOT NULL THEN
    -- Create user profile automatically
    INSERT INTO user_profiles (
      user_id,
      display_name,
      bio,
      goals,
      favorite_module,
      created_at,
      updated_at
    ) VALUES (
      NEW.user_id,
      'KongMindset Elev',
      'Behärskar Napoleon Hills framgångsprinciper',
      'Bygger rikedom genom tankesättstransformation',
      'Önskans kraft',
      NOW(),
      NOW()
    )
    -- Only insert if profile doesn't already exist
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Auto-created user profile for user_id: %', NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create profiles when auth users are linked
DROP TRIGGER IF EXISTS auto_create_profile_on_user_link ON stripe_customers;
CREATE TRIGGER auto_create_profile_on_user_link
  BEFORE UPDATE ON stripe_customers
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_user_profile_for_stripe_customer();

-- Let's also ensure the RLS policies allow users to see their own data
-- (These should already exist but let's make sure)

-- Ensure stripe_customers RLS policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'stripe_customers' 
    AND policyname = 'Users can view their own customer data'
  ) THEN
    CREATE POLICY "Users can view their own customer data"
      ON stripe_customers
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid() AND deleted_at IS NULL);
  END IF;
END $$;

-- Ensure user_profiles RLS policies exist  
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON user_profiles
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;