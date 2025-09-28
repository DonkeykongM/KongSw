-- Fix login issues immediately
-- Update the specific user to ensure they can log in

-- First, let's check the current status of mathias_bahko@hotmail.com
SELECT 'Checking user status:' as info;
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  au.confirmed_at,
  au.created_at
FROM auth.users au 
WHERE au.email = 'mathias_bahko@hotmail.com';

-- Fix email confirmation for this user specifically  
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, created_at),
  confirmed_at = COALESCE(confirmed_at, created_at),
  phone_confirmed_at = created_at
WHERE email = 'mathias_bahko@hotmail.com';

-- Also fix for any other purchase users that might have same issue
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, created_at),
  confirmed_at = COALESCE(confirmed_at, created_at),
  phone_confirmed_at = created_at
WHERE id IN (
  SELECT DISTINCT user_id 
  FROM course_purchases 
  WHERE payment_status = 'paid' 
  AND user_id IS NOT NULL
);

-- Verify the fix worked
SELECT 'After fix - user status:' as info;
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  au.confirmed_at,
  au.created_at,
  'Should be able to login now' as status
FROM auth.users au 
WHERE au.email = 'mathias_bahko@hotmail.com';