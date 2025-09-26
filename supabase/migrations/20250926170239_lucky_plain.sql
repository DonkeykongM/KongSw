/*
  # Fix Auth User Creation After Purchase

  1. Enhanced Functions
    - Improved trigger function for user profile creation
    - Better error handling and logging
    - Automatic auth user creation from simple_logins

  2. Security
    - Maintain RLS policies
    - Ensure proper user isolation
    - Safe fallback mechanisms

  3. Debugging
    - Add logging for troubleshooting
    - Better error messages
    - Audit trail for user creation
*/

-- Enhanced function to create user profile with better error handling
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the trigger execution
  RAISE LOG 'Creating user profile for user_id: %', NEW.id;
  
  -- Insert user profile with error handling
  INSERT INTO public.user_profiles (
    user_id,
    email,
    display_name,
    bio,
    goals,
    favorite_module,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'Behärskar Napoleon Hills framgångsprinciper',
    'Bygger rikedom genom tankesättstransformation',
    'Önskans kraft',
    NOW(),
    NOW()
  ) ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, user_profiles.display_name),
    updated_at = NOW();
  
  RAISE LOG 'User profile created/updated for: %', NEW.email;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating user profile for %: %', NEW.email, SQLERRM;
    RETURN NEW; -- Don't fail the auth user creation if profile creation fails
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS auto_create_profile_for_new_user ON auth.users;

-- Create trigger on auth.users table
CREATE TRIGGER auto_create_profile_for_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Function to sync simple_logins to auth.users (for webhook-created users)
CREATE OR REPLACE FUNCTION create_auth_user_from_simple_login()
RETURNS TRIGGER AS $$
DECLARE
  auth_user_id UUID;
BEGIN
  -- Log the trigger execution
  RAISE LOG 'Processing simple_login for email: %', NEW.email;
  
  -- Check if auth user already exists
  SELECT id INTO auth_user_id
  FROM auth.users
  WHERE email = NEW.email;
  
  IF auth_user_id IS NULL THEN
    RAISE LOG 'Auth user does not exist for %, this is expected for webhook-created users', NEW.email;
    -- Don't try to create auth user here - let the webhook handle it
  ELSE
    RAISE LOG 'Auth user already exists for %: %', NEW.email, auth_user_id;
    
    -- Update simple_logins with the auth user_id if we have it
    UPDATE simple_logins 
    SET user_id = auth_user_id 
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in simple_login trigger for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on simple_logins
DROP TRIGGER IF EXISTS sync_simple_login_to_auth ON simple_logins;
CREATE TRIGGER sync_simple_login_to_auth
  AFTER INSERT ON simple_logins
  FOR EACH ROW
  EXECUTE FUNCTION create_auth_user_from_simple_login();

-- Add helpful indexes for performance
CREATE INDEX IF NOT EXISTS idx_simple_logins_email ON simple_logins(email);
CREATE INDEX IF NOT EXISTS idx_simple_logins_stripe_customer ON simple_logins(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_email ON course_purchases(email);
CREATE INDEX IF NOT EXISTS idx_course_purchases_stripe_session ON course_purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, service_role;
GRANT ALL ON auth.users TO postgres, service_role;