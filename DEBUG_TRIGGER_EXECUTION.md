# 🚨 Supabase Triggers Not Executing After Purchase - Debug Guide

## PROBLEM DIAGNOSIS ✅

### Root Cause Identified:
**Triggers are not firing because:**
1. **Timing Issue:** Webhook creates stripe_customers with user_id in single INSERT
2. **Trigger Gap:** Only UPDATE trigger exists, not INSERT trigger  
3. **Race Condition:** Auth user and stripe_customers created simultaneously
4. **Missing Backup:** No direct profile creation in webhook

## 🎯 CURRENT TRIGGER ANALYSIS

### Existing Trigger (PROBLEMATIC):
```sql
CREATE TRIGGER auto_create_profile_on_user_link 
BEFORE UPDATE ON public.stripe_customers 
FOR EACH ROW 
EXECUTE FUNCTION auto_create_user_profile_for_stripe_customer()
```

**PROBLEM:** Webhook does INSERT, not UPDATE!

### Missing Triggers:
- ❌ No INSERT trigger on stripe_customers
- ❌ No trigger on auth.users table  
- ❌ No backup mechanism in webhook function

## 🔧 COMPREHENSIVE FIX IMPLEMENTED

### Fix 1: Dual Trigger Coverage
```sql
-- INSERT trigger (NEW!)
CREATE TRIGGER auto_create_profile_on_customer_insert
  AFTER INSERT ON public.stripe_customers
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION auto_create_user_profile_for_stripe_customer();

-- UPDATE trigger (ENHANCED)
CREATE TRIGGER auto_create_profile_on_customer_update
  AFTER UPDATE ON public.stripe_customers
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL AND (OLD.user_id IS NULL OR OLD.user_id != NEW.user_id))
  EXECUTE FUNCTION auto_create_user_profile_for_stripe_customer();
```

### Fix 2: Auth User Trigger (BACKUP)
```sql
-- Direct trigger on auth.users creation
CREATE TRIGGER auto_create_profile_for_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_profile_for_new_user();
```

### Fix 3: Webhook Backup Mechanism
Enhanced webhook function now creates profiles directly if triggers fail.

## 📋 DEBUGGING COMMANDS

### Check Trigger Status:
```sql
-- See all triggers
SELECT schemaname, tablename, triggername, triggerdef 
FROM pg_triggers 
WHERE schemaname = 'public' 
ORDER BY tablename, triggername;

-- Check trigger functions exist
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname LIKE '%profile%';
```

### Test Triggers Manually:
```sql
-- Test 1: Insert new stripe_customer (should create profile)
INSERT INTO stripe_customers (user_id, customer_id) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'cus_test_trigger');

-- Test 2: Update existing customer (should also work)
UPDATE stripe_customers 
SET user_id = '550e8400-e29b-41d4-a716-446655440001' 
WHERE customer_id = 'cus_test_trigger';

-- Test 3: Create auth user (should auto-create profile)
-- Do this via Supabase Auth, not direct SQL
```

### Monitor Trigger Execution:
```sql
-- Check if profiles were created
SELECT 
    up.id, up.user_id, up.display_name, up.created_at,
    sc.customer_id, sc.created_at as customer_created
FROM user_profiles up
FULL OUTER JOIN stripe_customers sc ON up.user_id = sc.user_id
ORDER BY GREATEST(up.created_at, sc.created_at) DESC;
```

## 🧪 TESTING PROCEDURE

### Phase 1: Database Level Testing
1. **Open Supabase SQL Editor**
2. **Run manual trigger tests** (above SQL commands)
3. **Verify profile creation** in user_profiles table
4. **Check for errors** in database logs

### Phase 2: Webhook Testing
1. **Test Stripe webhook** with test event
2. **Monitor Edge Function logs** for execution
3. **Verify database updates** happen correctly
4. **Check user creation flow** end-to-end

### Phase 3: Purchase Flow Testing
1. **Complete test purchase** with new email
2. **Monitor real-time table updates**:
   - auth.users (new user)
   - stripe_customers (new customer record)
   - user_profiles (auto-created profile)
3. **Test immediate login** after purchase
4. **Verify course access** is granted

## 🔍 REAL-TIME MONITORING

### Enable Realtime for Testing:
```sql
-- Enable realtime on tables
ALTER publication supabase_realtime ADD TABLE stripe_customers;
ALTER publication supabase_realtime ADD TABLE user_profiles;
```

### Watch Tables During Test:
1. **Open 3 tabs in Supabase Table Editor:**
   - Tab 1: auth.users
   - Tab 2: stripe_customers  
   - Tab 3: user_profiles
2. **Enable "Enable Realtime"** on each tab
3. **Complete test purchase**
4. **Watch tables update in real-time**

## 🎯 EXPECTED RESULTS AFTER FIX

### Before Test:
```
stripe_customers: 3 rows (August data)
user_profiles: 4 rows (existing profiles)
auth.users: 4 users (existing users)
```

### After Successful Test Purchase:
```
stripe_customers: 4 rows (+ NEW test user)
user_profiles: 5 rows (+ NEW auto-created profile)  
auth.users: 5 users (+ NEW auth user)
```

### Complete Record Linkage:
```sql
-- This query should return the test user with all linked data
SELECT 
    au.email,
    sc.customer_id,
    up.display_name,
    up.created_at as profile_created,
    sc.created_at as customer_created,
    au.created_at as auth_created
FROM auth.users au
JOIN stripe_customers sc ON au.id = sc.user_id
JOIN user_profiles up ON au.id = up.user_id
WHERE au.email = 'test@kongmindset.se'
ORDER BY au.created_at DESC;
```

## ⚠️ TROUBLESHOOTING

### If Triggers Still Don't Fire:
1. **Check permissions:** Trigger functions need proper security context
2. **Verify table ownership:** Make sure triggers are owned by correct role
3. **Check RLS policies:** Row Level Security might block trigger execution
4. **Monitor logs:** Enable detailed logging to see execution path

### If Profiles Not Created:
1. **Manual creation via webhook:** Enhanced webhook now creates directly
2. **Trigger function logs:** Check for function execution errors
3. **Foreign key constraints:** Verify user_id references are valid
4. **Data validation:** Ensure all required fields have default values

### Emergency Manual Fix:
```sql
-- If automation fails, manual profile creation:
INSERT INTO user_profiles (user_id, display_name, bio, goals, favorite_module)
SELECT 
    sc.user_id,
    split_part(au.email, '@', 1),
    'Behärskar Napoleon Hills framgångsprinciper',
    'Bygger rikedom genom tankesättstransformation', 
    'Önskans kraft'
FROM stripe_customers sc
JOIN auth.users au ON sc.user_id = au.id
LEFT JOIN user_profiles up ON sc.user_id = up.user_id
WHERE up.user_id IS NULL;
```

## 🚀 POST-FIX VALIDATION

### Success Indicators:
- ✅ New purchases create auth users immediately
- ✅ stripe_customers records have proper user_id linkage
- ✅ user_profiles auto-created within seconds
- ✅ Users can log in immediately after purchase
- ✅ Full course access granted automatically
- ✅ No manual intervention required

### Monitor These Metrics:
- **Trigger execution rate:** Should be 100% for new purchases
- **Profile creation latency:** Should be < 1 second after user creation
- **Login success rate:** Should be 100% for post-purchase logins
- **Database consistency:** All users should have corresponding profiles

**The enhanced trigger system with backup mechanisms ensures bulletproof user account creation! 🎯**