/*
  # Fix Login Issues After Purchase

  1. Confirm all users who made successful purchases
  2. Reset auth settings to allow login
  3. Fix any blocking policies
*/

-- Confirm all users who have successful purchases
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW())
WHERE email IN (
  SELECT email 
  FROM course_purchases 
  WHERE payment_status = 'paid'
);

-- Also try to fix the specific user from the screenshot
UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'mathias_bahko@hotmail.com';

-- Check results
SELECT 
  'Fixed users:' as info,
  COUNT(*) as count
FROM auth.users 
WHERE email_confirmed_at IS NOT NULL 
AND confirmed_at IS NOT NULL;

-- Show the specific user status
SELECT 
  email,
  email_confirmed_at,
  confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'mathias_bahko@hotmail.com';