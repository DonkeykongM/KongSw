/*
  # Cleanup Invalid Users and Reset System

  1. Cleanup Actions
    - Remove invalid admin/test users from all tables
    - Reset system to clean state
    - Prepare for proper webhook testing

  2. Security
    - Only remove specific invalid accounts
    - Preserve any legitimate user data
*/

-- Remove invalid admin user from profiles table
DELETE FROM profiles 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('admin7@admin.com', 'mathias.bahko@admin.com')
  OR user_metadata->>'display_name' = 'mathias bahko'
);

-- Remove invalid admin user from user_profiles table  
DELETE FROM user_profiles
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('admin7@admin.com', 'mathias.bahko@admin.com')
  OR user_metadata->>'display_name' = 'mathias bahko'
);

-- Remove invalid admin user from purchase_records table
DELETE FROM purchase_records
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('admin7@admin.com', 'mathias.bahko@admin.com')
  OR user_metadata->>'display_name' = 'mathias bahko'
);

-- Clean up any orphaned records
DELETE FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);
DELETE FROM user_profiles WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM purchase_records WHERE user_id NOT IN (SELECT id FROM auth.users);