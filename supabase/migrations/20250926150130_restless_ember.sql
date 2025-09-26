-- Fix login problem for existing users
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, created_at),
  confirmed_at = COALESCE(confirmed_at, created_at),
  phone_confirmed_at = COALESCE(phone_confirmed_at, created_at)
WHERE email_confirmed_at IS NULL;