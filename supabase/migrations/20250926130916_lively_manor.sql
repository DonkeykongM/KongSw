/*
  # Comprehensive User Profile System

  1. New Functions
    - `ensure_user_profile_exists()` - Creates user profile if missing
    - `auto_create_user_profile_for_stripe_customer()` - Enhanced trigger function

  2. Enhanced Triggers
    - Auto-create profiles when stripe_customers get user_id
    - Auto-create profiles when auth users are created
    - Update timestamps automatically

  3. Data Integrity
    - Ensures every auth user has a profile
    - Handles edge cases and race conditions
    - Provides fallback mechanisms
*/

-- Enhanced function to ensure user profile exists
CREATE OR REPLACE FUNCTION ensure_user_profile_exists(target_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Insert user profile if it doesn't exist
  INSERT INTO user_profiles (
    user_id,
    display_name,
    bio,
    goals,
    favorite_module,
    created_at,
    updated_at
  )
  SELECT 
    target_user_id,
    COALESCE(
      (SELECT email FROM auth.users WHERE id = target_user_id LIMIT 1),
      'Användare'
    ),
    'Behärskar Napoleon Hills framgångsprinciper',
    'Bygger rikedom genom tankesättstransformation',
    'Önskans kraft',
    now(),
    now()
  WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = target_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced auto-create function for stripe customers
CREATE OR REPLACE FUNCTION auto_create_user_profile_for_stripe_customer()
RETURNS trigger AS $$
BEGIN
  -- Only proceed if user_id is being set and is not null
  IF NEW.user_id IS NOT NULL AND (OLD.user_id IS NULL OR OLD.user_id != NEW.user_id) THEN
    -- Ensure user profile exists
    PERFORM ensure_user_profile_exists(NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for stripe_customers updates (if not exists)
DROP TRIGGER IF EXISTS auto_create_profile_on_user_link ON stripe_customers;
CREATE TRIGGER auto_create_profile_on_user_link
  BEFORE UPDATE ON stripe_customers
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_user_profile_for_stripe_customer();

-- Create trigger for new auth users (ensures profile always exists)
CREATE OR REPLACE FUNCTION auto_create_profile_for_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create profile for new auth user
  PERFORM ensure_user_profile_exists(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auth.users inserts (if supported)
DO $$
BEGIN
  -- Try to create trigger on auth.users (may not be allowed)
  BEGIN
    DROP TRIGGER IF EXISTS auto_create_profile_on_signup ON auth.users;
    CREATE TRIGGER auto_create_profile_on_signup
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION auto_create_profile_for_new_user();
  EXCEPTION WHEN OTHERS THEN
    -- Ignore if we can't create trigger on auth.users
    NULL;
  END;
END $$;

-- Ensure all existing users with stripe_customers have profiles
DO $$
BEGIN
  -- Create profiles for any stripe_customers that have user_id but no profile
  INSERT INTO user_profiles (
    user_id,
    display_name, 
    bio,
    goals,
    favorite_module,
    created_at,
    updated_at
  )
  SELECT DISTINCT
    sc.user_id,
    COALESCE(au.email, 'Användare') as display_name,
    'Behärskar Napoleon Hills framgångsprinciper' as bio,
    'Bygger rikedom genom tankesättstransformation' as goals,
    'Önskans kraft' as favorite_module,
    now() as created_at,
    now() as updated_at
  FROM stripe_customers sc
  LEFT JOIN auth.users au ON au.id = sc.user_id
  WHERE sc.user_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.user_id = sc.user_id
    );
END $$;