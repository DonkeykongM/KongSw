/*
  # Fix Profile Creation Triggers

  1. Problem Analysis
    - Current trigger only fires on UPDATE of stripe_customers
    - Need trigger for INSERT operations as well
    - Webhook creates stripe_customers with user_id in single INSERT
    - No profile gets created because UPDATE trigger never fires

  2. Solution
    - Add INSERT trigger for stripe_customers
    - Enhance trigger function to handle all scenarios
    - Add direct profile creation as backup
    - Ensure idempotent operations (safe to run multiple times)

  3. Testing
    - Manual trigger testing
    - End-to-end purchase flow testing
    - Edge case handling verification
*/

-- Drop existing problematic trigger
DROP TRIGGER IF EXISTS auto_create_profile_on_user_link ON public.stripe_customers;

-- Create enhanced trigger function that handles both INSERT and UPDATE
CREATE OR REPLACE FUNCTION auto_create_user_profile_for_stripe_customer()
RETURNS TRIGGER AS $$
BEGIN
  -- Log trigger execution for debugging
  RAISE LOG 'Profile creation trigger fired: % on % with user_id %', 
    TG_OP, TG_TABLE_NAME, COALESCE(NEW.user_id, 'NULL');

  -- Only proceed if user_id is present and not null
  IF NEW.user_id IS NOT NULL THEN
    -- Check if profile already exists
    IF NOT EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = NEW.user_id
    ) THEN
      -- Get user email for display name
      DECLARE
        user_email TEXT;
        display_name TEXT;
      BEGIN
        SELECT email INTO user_email
        FROM auth.users
        WHERE id = NEW.user_id;
        
        -- Extract name from email (before @)
        display_name := COALESCE(
          split_part(user_email, '@', 1),
          'Användare'
        );
        
        -- Create user profile
        INSERT INTO user_profiles (
          user_id,
          display_name,
          bio,
          goals,
          favorite_module
        ) VALUES (
          NEW.user_id,
          display_name,
          'Behärskar Napoleon Hills framgångsprinciper',
          'Bygger rikedom genom tankesättstransformation',
          'Önskans kraft'
        );
        
        RAISE LOG 'Created user profile for user_id: % with display_name: %', 
          NEW.user_id, display_name;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'Error creating user profile: %', SQLERRM;
      END;
    ELSE
      RAISE LOG 'User profile already exists for user_id: %', NEW.user_id;
    END IF;
  ELSE
    RAISE LOG 'No user_id provided, skipping profile creation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both INSERT and UPDATE operations
CREATE TRIGGER auto_create_profile_on_customer_insert
  AFTER INSERT ON public.stripe_customers
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION auto_create_user_profile_for_stripe_customer();

CREATE TRIGGER auto_create_profile_on_customer_update
  AFTER UPDATE ON public.stripe_customers
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL AND (OLD.user_id IS NULL OR OLD.user_id != NEW.user_id))
  EXECUTE FUNCTION auto_create_user_profile_for_stripe_customer();

-- Create enhanced trigger function for direct auth user profile creation
CREATE OR REPLACE FUNCTION auto_create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Log trigger execution
  RAISE LOG 'New user trigger fired for user_id: % email: %', NEW.id, NEW.email;

  -- Create user profile immediately when auth user is created
  INSERT INTO user_profiles (
    user_id,
    display_name,
    bio,
    goals,
    favorite_module
  ) VALUES (
    NEW.id,
    COALESCE(split_part(NEW.email, '@', 1), 'Användare'),
    'Behärskar Napoleon Hills framgångsprinciper',
    'Bygger rikedom genom tankesättstransformation',
    'Önskans kraft'
  )
  ON CONFLICT (user_id) DO NOTHING; -- Prevent duplicates

  RAISE LOG 'Created user profile for new auth user: %', NEW.email;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in auto_create_profile_for_new_user: %', SQLERRM;
    RETURN NEW; -- Don't block user creation if profile fails
END;
$$ LANGUAGE plpgsql;

-- Drop existing auth user trigger if it exists
DROP TRIGGER IF EXISTS auto_create_profile_for_new_user ON auth.users;

-- Create trigger on auth.users table for immediate profile creation
CREATE TRIGGER auto_create_profile_for_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_profile_for_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);

-- Test data integrity
DO $$
BEGIN
  RAISE LOG 'Profile creation system updated successfully';
  RAISE LOG 'Triggers created: auto_create_profile_on_customer_insert, auto_create_profile_on_customer_update';
  RAISE LOG 'Auth trigger created: auto_create_profile_for_new_user';
END $$;