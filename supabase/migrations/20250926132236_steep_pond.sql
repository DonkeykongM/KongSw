-- Test Script: Verify Supabase Triggers Execute Properly
-- Run this in Supabase SQL Editor to test trigger functionality

-- Step 1: Check current state BEFORE test
SELECT 'BEFORE TEST - Current user_profiles count' as status, COUNT(*) as count 
FROM user_profiles;

SELECT 'BEFORE TEST - Current stripe_customers count' as status, COUNT(*) as count 
FROM stripe_customers;

-- Step 2: Create a test auth user first (simulating webhook creating auth user)
-- Note: This would normally be done by the webhook, but we're testing manually

-- Generate a test UUID for our test user
SELECT 'Test user_id to use' as info, gen_random_uuid() as test_user_id;

-- Step 3: Insert test stripe_customer with user_id (this should trigger profile creation)
-- Replace 'TEST_USER_ID_HERE' with the UUID from step 2
INSERT INTO stripe_customers (user_id, customer_id, created_at, updated_at) 
VALUES (
  'TEST_USER_ID_HERE', -- Replace this with actual UUID from step 2
  'cus_test_trigger_test_' || extract(epoch from now())::text,
  now(),
  now()
);

-- Step 4: Check if trigger created user_profile automatically
SELECT 'AFTER INSERT - Did trigger create profile?' as status;

SELECT 
  sc.customer_id,
  sc.user_id,
  up.display_name,
  up.created_at as profile_created,
  sc.created_at as customer_created,
  CASE 
    WHEN up.user_id IS NOT NULL THEN '✅ TRIGGER WORKED!'
    ELSE '❌ TRIGGER FAILED!'
  END as trigger_result
FROM stripe_customers sc
LEFT JOIN user_profiles up ON sc.user_id = up.user_id
WHERE sc.customer_id LIKE 'cus_test_trigger_test_%'
ORDER BY sc.created_at DESC;

-- Step 5: Check all triggers exist
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing,
  CASE 
    WHEN trigger_name LIKE '%profile%' THEN '✅ Profile trigger found'
    ELSE '⚠️ Other trigger'
  END as trigger_type
FROM information_schema.triggers 
WHERE event_object_schema = 'public'
AND (event_object_table = 'stripe_customers' OR trigger_name LIKE '%profile%')
ORDER BY event_object_table, trigger_name;

-- Step 6: Cleanup test data (run this after testing)
-- DELETE FROM user_profiles WHERE user_id IN (
--   SELECT user_id FROM stripe_customers WHERE customer_id LIKE 'cus_test_trigger_test_%'
-- );
-- DELETE FROM stripe_customers WHERE customer_id LIKE 'cus_test_trigger_test_%';

-- Final check: Verify current counts match expected
SELECT 'FINAL COUNT - user_profiles' as table_name, COUNT(*) as final_count 
FROM user_profiles
UNION ALL
SELECT 'FINAL COUNT - stripe_customers' as table_name, COUNT(*) as final_count 
FROM stripe_customers;