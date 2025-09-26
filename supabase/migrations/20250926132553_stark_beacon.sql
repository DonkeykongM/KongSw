-- KongMindset Trigger Test - Copy this exact code
-- Step 1: Check current state BEFORE test
SELECT 'BEFORE TEST - Current user_profiles count' as status, COUNT(*) as count 
FROM user_profiles;

SELECT 'BEFORE TEST - Current stripe_customers count' as status, COUNT(*) as count 
FROM stripe_customers;

-- Step 2: Generate test UUID (COPY the result!)
SELECT 'Test user_id to use' as info, gen_random_uuid() as test_user_id;

-- Step 3: Insert test stripe_customer (REPLACE the UUID below!)
-- IMPORTANT: Replace 'PASTE_UUID_HERE' with the UUID from step 2
INSERT INTO stripe_customers (user_id, customer_id, created_at, updated_at) 
VALUES (
  'PASTE_UUID_HERE',
  'cus_test_trigger_' || extract(epoch from now())::text,
  now(),
  now()
);

-- Step 4: Check if trigger worked (run this after step 3)
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
WHERE sc.customer_id LIKE 'cus_test_trigger_%'
ORDER BY sc.created_at DESC
LIMIT 1;

-- Step 5: Cleanup after test (run this at the end)
DELETE FROM user_profiles 
WHERE user_id IN (
  SELECT user_id FROM stripe_customers 
  WHERE customer_id LIKE 'cus_test_trigger_%'
);

DELETE FROM stripe_customers 
WHERE customer_id LIKE 'cus_test_trigger_%';