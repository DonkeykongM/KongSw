-- ✅ TRIGGER TEST LYCKADES! Nu kontrollerar vi allt fungerar

-- 1. Kontrollera att testprofilen skapades
SELECT 
  'TRIGGER VERIFICATION' as test_type,
  COUNT(*) as profile_count,
  'Should be 1 test profile created' as expected
FROM user_profiles 
WHERE display_name = 'testuser';

-- 2. Se den kompletta länkningen
SELECT 
  '✅ COMPLETE USER CREATION TEST SUCCESSFUL!' as status,
  sc.customer_id,
  sc.user_id,
  up.display_name,
  up.bio,
  up.created_at
FROM stripe_customers sc
JOIN user_profiles up ON sc.user_id = up.user_id
WHERE sc.customer_id LIKE 'cus_test_trigger_%'
ORDER BY sc.created_at DESC
LIMIT 1;

-- 3. Rensa upp testdata (kör detta när du är klar)
-- DELETE FROM user_profiles WHERE display_name = 'testuser';
-- DELETE FROM stripe_customers WHERE customer_id LIKE 'cus_test_trigger_%';

-- 4. Kontrollera att triggers finns installerade
SELECT 
  'TRIGGER CHECK' as info,
  trigger_name,
  event_manipulation,
  'trigger_exists' as status
FROM information_schema.triggers 
WHERE event_object_table = 'stripe_customers'
AND trigger_name LIKE '%profile%';