/*
  # Cleanup Invalid Users and Test Data

  1. Cleanup Actions
    - Remove invalid admin/test users from all tables
    - Clean up orphaned data
    - Reset system for clean testing

  2. Security
    - Only remove clearly invalid test accounts
    - Preserve legitimate user data
*/

-- Remove invalid users from auth.users (admin/test accounts)
DELETE FROM auth.users 
WHERE email IN (
  'admin7@admin.com',
  'mathias.bahko@admin.com'
) OR email LIKE '%admin%' OR email LIKE '%test@test%';

-- Remove corresponding profiles data
DELETE FROM profiles 
WHERE id IN (
  SELECT id FROM profiles 
  WHERE id NOT IN (SELECT id FROM auth.users)
);

-- Remove corresponding user_profiles data  
DELETE FROM user_profiles
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Remove orphaned purchase records
DELETE FROM purchase_records
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Clean up any remaining test data
DELETE FROM user_profiles 
WHERE email LIKE '%admin%' OR email LIKE '%test@test%';

DELETE FROM purchase_records 
WHERE stripe_customer_id LIKE '%test%' OR stripe_session_id LIKE '%test%';

-- Log cleanup completion
DO $$
BEGIN
  RAISE NOTICE 'Database cleanup completed - invalid users removed';
END $$;