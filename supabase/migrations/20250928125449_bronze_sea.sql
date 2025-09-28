-- SUPABASE ANVÄNDARDATA DIAGNOSTIK
-- Kör dessa queries i Supabase SQL Editor för att hitta problemet

-- 1. KONTROLLERA ALLA ANVÄNDARTABELLER
SELECT 'auth.users' as table_name, count(*) as user_count FROM auth.users
UNION ALL
SELECT 'user_profiles' as table_name, count(*) as user_count FROM user_profiles
UNION ALL  
SELECT 'purchase_records' as table_name, count(*) as user_count FROM purchase_records;

-- 2. VISA ALLA ANVÄNDARE I AUTH.USERS (HUVUDTABELL)
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;

-- 3. VISA ANVÄNDARPROFILER
SELECT 
    id,
    user_id,
    email,
    display_name,
    created_at,
    purchase_date
FROM user_profiles 
ORDER BY created_at DESC
LIMIT 10;

-- 4. VISA KÖPHISTORIK
SELECT 
    id,
    user_id,
    stripe_customer_id,
    amount_paid,
    currency,
    payment_status,
    purchased_at
FROM purchase_records 
ORDER BY purchased_at DESC
LIMIT 10;

-- 5. KONTROLLERA TABELLSTRUKTURER
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'purchase_records')
ORDER BY table_name, ordinal_position;

-- 6. KONTROLLERA RLS-POLICIES
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'purchase_records');

-- 7. KONTROLLERA TRIGGERS
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'public'
ORDER BY event_object_table;