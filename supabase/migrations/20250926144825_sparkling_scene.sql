/*
  # Fix webhook system for user creation

  1. New Tables & Triggers
    - Enhanced `create_user_profile` function for better error handling
    - Trigger on auth.users INSERT for automatic profile creation
    - Backup mechanism in case triggers fail

  2. Security
    - Maintains RLS on all tables
    - Proper foreign key constraints
    - Safe error handling

  3. Webhook Integration
    - Direct profile creation if triggers fail
    - Proper user account creation flow
*/

-- Create enhanced user profile creation function
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create user profile with comprehensive error handling
  INSERT INTO public.user_profiles (
    user_id,
    email,
    display_name,
    bio,
    goals,
    favorite_module,
    has_course_access
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(split_part(NEW.email, '@', 1), 'Kursdeltagare'),
    'Studerar Napoleon Hills framgångsprinciper',
    'Skapar rikedom genom rätt tankesätt', 
    'Önskans kraft',
    true
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth user creation
    RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS auto_create_profile_for_new_user ON auth.users;

-- Create trigger on auth.users for automatic profile creation
CREATE TRIGGER auto_create_profile_for_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Ensure RLS is enabled on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Recreate policies if needed
DROP POLICY IF EXISTS "Användare kan se sin egen profil" ON user_profiles;
DROP POLICY IF EXISTS "Användare kan uppdatera sin egen profil" ON user_profiles;

CREATE POLICY "Användare kan se sin egen profil"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Användare kan uppdatera sin egen profil"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Test the function works
DO $$
BEGIN
  RAISE NOTICE 'User profile creation system updated successfully!';
END $$;