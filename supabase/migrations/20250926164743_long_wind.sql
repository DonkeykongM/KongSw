/*
  # Sync simple_logins to auth.users

  This migration creates a function to sync users from simple_logins table to auth.users
  when they try to log in but don't exist in auth.users yet.

  1. Function to create auth users from simple_logins
  2. Trigger to auto-sync when needed
*/

-- Function to create auth user from simple_logins data
CREATE OR REPLACE FUNCTION create_auth_user_from_simple_login()
RETURNS TRIGGER AS $$
DECLARE
  auth_user_id uuid;
BEGIN
  -- Try to create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    NEW.id,
    'authenticated',
    'authenticated',
    NEW.email,
    crypt(NEW.password_hash, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) ON CONFLICT (email) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the trigger
    RAISE WARNING 'Failed to create auth user for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-sync new simple_logins to auth.users
DROP TRIGGER IF EXISTS sync_simple_login_to_auth ON simple_logins;
CREATE TRIGGER sync_simple_login_to_auth
  AFTER INSERT ON simple_logins
  FOR EACH ROW
  EXECUTE FUNCTION create_auth_user_from_simple_login();