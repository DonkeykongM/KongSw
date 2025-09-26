# 🧪 Manual Trigger Test - KongMindset

## SYFTE
Testa om Supabase triggers fungerar korrekt genom att manuellt lägga till en stripe_customer med user_id och se om user_profile skapas automatiskt.

## 🎯 FÖRVÄNTAT RESULTAT
- ✅ När vi lägger till stripe_customer med user_id
- ✅ Trigger ska automatiskt skapa user_profile
- ✅ Både stripe_customers och user_profiles ska ha samma user_id

## 📋 TESTKÖRNING

### Steg 1: Gå till Supabase SQL Editor
1. **Öppna Supabase Dashboard**
2. **Klicka på "SQL Editor"** i vänster menyn
3. **Öppna filen:** `TEST_TRIGGER_EXECUTION.sql`

### Steg 2: Kör SQL-kommandona steg för steg

#### Kommando 1: Kontrollera nuvarande tillstånd
```sql
SELECT 'BEFORE TEST - Current user_profiles count' as status, COUNT(*) as count 
FROM user_profiles;

SELECT 'BEFORE TEST - Current stripe_customers count' as status, COUNT(*) as count 
FROM stripe_customers;
```
**Förväntat resultat:**
- user_profiles: 4 rader
- stripe_customers: 3 rader

#### Kommando 2: Generera test UUID
```sql
SELECT 'Test user_id to use' as info, gen_random_uuid() as test_user_id;
```
**KOPIERA UUID som visas i resultatet!**

#### Kommando 3: Skapa test stripe_customer (KRITISKT!)
```sql
-- ERSÄTT 'TEST_USER_ID_HERE' med UUID från steg 2!
INSERT INTO stripe_customers (user_id, customer_id, created_at, updated_at) 
VALUES (
  'KLISTRA_IN_UUID_HÄR',
  'cus_test_trigger_test_' || extract(epoch from now())::text,
  now(),
  now()
);
```

#### Kommando 4: Kontrollera om trigger fungerade
```sql
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
```

### Steg 3: Analysera resultatet

#### Om trigger FUNGERAR:
- ✅ Kolumnen `display_name` kommer att ha ett värde
- ✅ `trigger_result` kommer att visa "✅ TRIGGER WORKED!"
- ✅ `profile_created` kommer att ha en tidsstämpel

#### Om trigger MISSLYCKAS:
- ❌ `display_name` kommer att vara NULL
- ❌ `trigger_result` kommer att visa "❌ TRIGGER FAILED!"
- ❌ `profile_created` kommer att vara NULL

## 🔧 OM TRIGGER MISSLYCKAS

### Kontrollera triggers finns:
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers 
WHERE event_object_table = 'stripe_customers'
AND trigger_name LIKE '%profile%';
```

### Manuell profilskapande (backup):
```sql
INSERT INTO user_profiles (user_id, display_name, bio, goals, favorite_module)
VALUES (
  'KLISTRA_IN_SAMMA_UUID_HÄR',
  'testuser',
  'Behärskar Napoleon Hills framgångsprinciper',
  'Bygger rikedom genom tankesättstransformation',
  'Önskans kraft'
);
```

## 🧹 CLEANUP EFTER TEST

När testet är klart, rensa testdata:
```sql
-- Ta bort testprofil
DELETE FROM user_profiles 
WHERE user_id IN (
  SELECT user_id FROM stripe_customers 
  WHERE customer_id LIKE 'cus_test_trigger_test_%'
);

-- Ta bort test stripe_customer
DELETE FROM stripe_customers 
WHERE customer_id LIKE 'cus_test_trigger_test_%';
```

## 🎯 GÖR TESTET NU!

**Kör SQL-kommandona i Supabase SQL Editor och rapportera:**
1. Vad är resultatet av trigger_result-kolumnen?
2. Skapades user_profile automatiskt?
3. Vilka triggers visas i trigger-kontrollen?

**Detta kommer att bevisa om trigger-systemet fungerar korrekt! 🚀**