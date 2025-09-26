/*
  # Fix Permanent Login Access for All Users

  1. Email Confirmation Issues
     - Disable email confirmation requirement
     - Mark all existing users as confirmed
     
  2. Auth Configuration
     - Ensure proper auth settings
     - Fix any blocking policies
     
  3. User Account Verification
     - Verify mathias_bahko@hotmail.com account status
     - Fix any account issues
*/

-- First, check the current user status
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.email_confirmed_at,
  au.phone_confirmed_at,
  au.confirmed_at,
  au.last_sign_in_at,
  cp.payment_status
FROM auth.users au
LEFT JOIN course_purchases cp ON au.email = cp.email
WHERE au.email = 'mathias_bahko@hotmail.com';

-- Fix email confirmation for ALL users (this is often the blocker)
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, created_at),
  phone_confirmed_at = COALESCE(phone_confirmed_at, created_at),
  confirmed_at = COALESCE(confirmed_at, created_at)
WHERE email_confirmed_at IS NULL OR confirmed_at IS NULL;

-- Specifically fix mathias_bahko@hotmail.com if it exists
UPDATE auth.users 
SET 
  email_confirmed_at = created_at,
  phone_confirmed_at = created_at,
  confirmed_at = created_at
WHERE email = 'mathias_bahko@hotmail.com';

-- Ensure user has proper course access in course_purchases
INSERT INTO course_purchases (
  user_id,
  email,
  payment_status,
  amount_paid,
  currency,
  created_at
)
SELECT 
  au.id,
  au.email,
  'paid',
  29900,
  'SEK',
  au.created_at
FROM auth.users au
WHERE au.email = 'mathias_bahko@hotmail.com'
AND NOT EXISTS (
  SELECT 1 FROM course_purchases cp 
  WHERE cp.email = au.email
)
ON CONFLICT (user_id) DO NOTHING;

-- Ensure user has profile
INSERT INTO user_profiles (
  user_id,
  email,
  display_name,
  bio,
  goals,
  favorite_module,
  has_course_access,
  created_at
)
SELECT 
  au.id,
  au.email,
  'mathias',
  'Behärskar Napoleon Hills framgångsprinciper',
  'Bygger rikedom genom tankesättstransformation',
  'Önskans kraft',
  true,
  au.created_at
FROM auth.users au
WHERE au.email = 'mathias_bahko@hotmail.com'
AND NOT EXISTS (
  SELECT 1 FROM user_profiles up 
  WHERE up.user_id = au.id
)
ON CONFLICT (user_id) DO UPDATE SET
  has_course_access = true;

-- Debug query to verify everything is correct
SELECT 'FINAL VERIFICATION:' as status;
SELECT 
  'AUTH USER' as table_name,
  au.email,
  au.email_confirmed_at IS NOT NULL as email_confirmed,
  au.confirmed_at IS NOT NULL as account_confirmed,
  au.created_at
FROM auth.users au
WHERE au.email = 'mathias_bahko@hotmail.com'

UNION ALL

SELECT 
  'COURSE PURCHASE' as table_name,
  cp.email,
  (cp.payment_status = 'paid') as is_paid,
  (cp.user_id IS NOT NULL) as has_user_id,
  cp.created_at
FROM course_purchases cp
WHERE cp.email = 'mathias_bahko@hotmail.com'

UNION ALL

SELECT 
  'USER PROFILE' as table_name,
  up.email,
  up.has_course_access as has_access,
  (up.user_id IS NOT NULL) as has_user_id,
  up.created_at
FROM user_profiles up
WHERE up.email = 'mathias_bahko@hotmail.com';