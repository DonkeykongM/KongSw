-- KongMindset Trigger Test - Skapa användare och kolla trigger
-- Kör denna SQL steg för steg för att testa om triggers fungerar

-- STEG 1: Kontrollera nuvarande tillstånd
SELECT 'FÖRE TEST - user_profiles antal' as status, COUNT(*) as count FROM user_profiles;
SELECT 'FÖRE TEST - stripe_customers antal' as status, COUNT(*) as count FROM stripe_customers;

-- STEG 2: Skapa en test UUID
SELECT 'ANVÄND DENNA UUID' as info, gen_random_uuid() as test_user_id;

-- STEG 3: Lägg till test stripe_customer (ERSÄTT med UUID från steg 2!)
-- VIKTIGT: Ersätt 'ERSÄTT_MED_UUID' med den UUID du fick från steg 2
INSERT INTO stripe_customers (user_id, customer_id, created_at, updated_at) 
VALUES (
  'ERSÄTT_MED_UUID',
  'cus_test_' || extract(epoch from now())::text,
  now(),
  now()
);

-- STEG 4: KONTROLLERA OM TRIGGER FUNGERADE (kör direkt efter INSERT)
SELECT 
  'TRIGGER TEST RESULTAT' as test_name,
  sc.customer_id,
  sc.user_id,
  up.display_name,
  up.bio,
  up.created_at as profile_created,
  sc.created_at as customer_created,
  CASE 
    WHEN up.user_id IS NOT NULL THEN '✅ TRIGGER FUNGERAR!'
    ELSE '❌ TRIGGER FUNGERAR INTE!'
  END as trigger_status
FROM stripe_customers sc
LEFT JOIN user_profiles up ON sc.user_id = up.user_id
WHERE sc.customer_id LIKE 'cus_test_%'
ORDER BY sc.created_at DESC
LIMIT 1;

-- STEG 5: Kontrollera nya tillståndet
SELECT 'EFTER TEST - user_profiles antal' as status, COUNT(*) as count FROM user_profiles;
SELECT 'EFTER TEST - stripe_customers antal' as status, COUNT(*) as count FROM stripe_customers;

-- CLEANUP: Ta bort testdata när testet är klart
-- DELETE FROM user_profiles WHERE user_id IN (SELECT user_id FROM stripe_customers WHERE customer_id LIKE 'cus_test_%');
-- DELETE FROM stripe_customers WHERE customer_id LIKE 'cus_test_%';