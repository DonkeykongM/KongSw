# Supabase Triggers/Functions Debug Guide - KongMindset Purchase Flow

## 🔍 ROOT CAUSE ANALYSIS

### Current Purchase Flow Issues:
1. **Stripe Webhook** triggers but database triggers don't execute
2. **Auth users** created but **user_profiles** not automatically generated
3. **stripe_customers** records created but **user_id linking** fails
4. **Triggers** exist but **execution conditions** not met

## 🚨 IDENTIFIED PROBLEMS

### Problem 1: Trigger Execution Order
```sql
-- Current trigger only fires on UPDATE, not INSERT
CREATE TRIGGER auto_create_profile_on_user_link 
BEFORE UPDATE ON public.stripe_customers 
FOR EACH ROW 
EXECUTE FUNCTION auto_create_user_profile_for_stripe_customer()
```
**Issue:** Webhook creates stripe_customers with user_id in INSERT, not UPDATE

### Problem 2: Missing INSERT Trigger
No trigger exists for when stripe_customers records are first created with user_id.

### Problem 3: Function Logic Gaps
Trigger functions may not handle all edge cases properly.

## 💡 COMPREHENSIVE SOLUTION

### Step 1: Check Current Trigger Status
```sql
-- Check existing triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'public'
AND event_object_table IN ('stripe_customers', 'user_profiles');

-- Check existing functions
SELECT 
    proname as function_name,
    proargtypes,
    prosrc
FROM pg_proc 
WHERE proname LIKE '%profile%' OR proname LIKE '%user%';
```

### Step 2: Fix Trigger Coverage
The main issue is triggers only fire on UPDATE, not INSERT. We need both.

### Step 3: Enhanced Function Implementation
Create robust trigger functions that handle all scenarios.

### Step 4: Test Manual Execution
Verify functions work independently before relying on automatic triggers.

## 🛠️ IMPLEMENTATION FIXES

### Fix 1: Complete Trigger System
Need triggers for both INSERT and UPDATE operations.

### Fix 2: Robust Function Logic
Enhanced error handling and edge case management.

### Fix 3: Direct Profile Creation in Webhook
Backup mechanism in webhook function itself.

## 📊 DEBUGGING STEPS

### Check 1: Trigger Execution Logs
```sql
-- Enable logging to see if triggers fire
SET log_statement = 'all';
SET log_min_duration_statement = 0;

-- Test manual trigger
INSERT INTO stripe_customers (user_id, customer_id) 
VALUES ('test-user-id', 'cus_test123');
```

### Check 2: Function Execution Test
```sql
-- Test trigger function manually
SELECT auto_create_user_profile_for_stripe_customer();
```

### Check 3: Webhook Execution Logs
Monitor Edge Function logs in Supabase Dashboard:
- Functions → stripe-webhook → Logs
- Look for errors or incomplete executions

## 🔧 TESTING PROCEDURE

### Test 1: Manual Database Test
1. Create test auth user
2. Create stripe_customers record with user_id
3. Verify user_profiles record is auto-created

### Test 2: End-to-End Purchase Test
1. Complete test purchase
2. Monitor all table updates in real-time
3. Verify complete user account creation

### Test 3: Edge Cases
1. Test duplicate customer creation
2. Test existing user with new purchase
3. Test webhook retries and failures

## 📋 SUCCESS CRITERIA
- ✅ Every purchase creates auth user
- ✅ stripe_customers record with correct user_id
- ✅ user_profiles record automatically generated
- ✅ All tables properly linked via foreign keys
- ✅ No manual intervention required