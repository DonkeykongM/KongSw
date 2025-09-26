# 🧪 STEP-BY-STEP TEST GUIDE: Verify Complete Purchase Flow

## PRE-TEST SETUP

### 1. Open Monitoring Dashboard
**Open 4 tabs in Supabase Dashboard:**

**Tab 1: Authentication → Users**
- Current count: Note the number
- Sort by: created_at (descending)

**Tab 2: Table Editor → stripe_customers**  
- Current count: Should be 3 rows from August
- Sort by: created_at (descending)

**Tab 3: Table Editor → user_profiles**
- Current count: Note existing profiles
- Sort by: created_at (descending)

**Tab 4: Edge Functions → stripe-webhook → Logs**
- Keep this open to monitor webhook execution

### 2. Test User Details
```
Email: newtest@kongmindset.se
Password: NewTest2025!
Expected Display Name: newtest
```

## 🎯 LIVE TEST EXECUTION

### Step 1: Initiate Purchase
1. **Open:** https://kongmindset.se
2. **Click:** "🔑 Logga in" (top right)
3. **Switch to:** "Skaffa tillgång" tab
4. **Fill in:**
   - E-postadress: `newtest@kongmindset.se`
   - Lösenord: `NewTest2025!`
   - Bekräfta lösenord: `NewTest2025!`
5. **Click:** "🛒 Köp fullständig tillgång - 299 kr"

**Expected:** Redirect to Stripe Checkout

### Step 2: Complete Test Payment
6. **In Stripe Checkout use:**
   - Card: `4242 4242 4242 4242`
   - Date: `12/34`
   - CVC: `123`
   - Name: `New Test`
7. **Click:** "Pay"

**Expected:** Payment success → redirect to success page

### Step 3: IMMEDIATE Database Verification
**🚨 Do this IMMEDIATELY after payment completes:**

8. **Tab 1 (Authentication):** Refresh
   - ✅ **SHOULD SEE:** `newtest@kongmindset.se` in users list
   - ✅ **CHECK:** created_at should be TODAY's timestamp

9. **Tab 2 (stripe_customers):** Refresh  
   - ✅ **SHOULD SEE:** 4th row (was 3 before)
   - ✅ **CHECK:** user_id is NOT NULL
   - ✅ **CHECK:** customer_id starts with "cus_"
   - ✅ **CHECK:** created_at is TODAY

10. **Tab 3 (user_profiles):** Refresh
    - ✅ **SHOULD SEE:** New profile for newtest
    - ✅ **CHECK:** user_id matches the one from stripe_customers
    - ✅ **CHECK:** display_name = "newtest"

11. **Tab 4 (Webhook Logs):** Check logs
    - ✅ **SHOULD SEE:** Recent webhook execution
    - ✅ **CHECK:** "Auth user created" message
    - ✅ **CHECK:** "Profile created" message
    - ❌ **LOOK FOR:** Any error messages

### Step 4: Test Login Access
12. **From success page click:** "Logga in och börja"
    - **OR go to:** https://kongmindset.se
13. **Click:** "🔑 Logga in"  
14. **Login with:**
    - Email: `newtest@kongmindset.se`
    - Password: `NewTest2025!`
15. **Click:** "Logga in på ditt konto"

**Expected:** Immediate login success → Course dashboard

### Step 5: Verify Course Access
16. **After login check:**
    - ✅ **Course modules visible:** All 13 modules
    - ✅ **User profile:** Shows "newtest" as display name
    - ✅ **Navigation works:** Can access Profile, Resources, etc.
    - ✅ **AI Mentor:** Blue brain button appears

## 📊 SUCCESS CRITERIA CHECKLIST

### Database Updates:
- [ ] **auth.users:** +1 new user (newtest@kongmindset.se)
- [ ] **stripe_customers:** +1 new row with proper user_id linkage
- [ ] **user_profiles:** +1 new profile auto-created
- [ ] **stripe_orders:** +1 new order record (if webhook creates it)

### User Experience:
- [ ] **Smooth purchase:** No errors during payment
- [ ] **Automatic redirect:** Success page after payment
- [ ] **Immediate login:** Can log in right after purchase
- [ ] **Full access:** All course content available
- [ ] **Profile working:** User settings and progress tracking

### Technical Verification:
- [ ] **Webhook execution:** Logs show successful webhook processing
- [ ] **Trigger execution:** Database logs show trigger firing
- [ ] **No manual steps:** Everything automated
- [ ] **Data consistency:** All foreign keys properly linked

## 🚨 FAILURE SCENARIOS & FIXES

### Scenario 1: Auth User Not Created
**Symptoms:** Payment succeeds but no user in Authentication
**Debug:**
```sql
-- Check webhook logs
SELECT * FROM edge_function_logs WHERE function_name = 'stripe-webhook' ORDER BY created_at DESC LIMIT 5;
```
**Fix:** Check Stripe webhook secret configuration

### Scenario 2: stripe_customers Missing user_id
**Symptoms:** Customer record created but user_id is NULL
**Debug:** Webhook function logic issue
**Fix:** Enhanced webhook function already handles this

### Scenario 3: user_profiles Not Created
**Symptoms:** Auth user + stripe_customers exist but no profile
**Debug:**
```sql
-- Check if triggers exist
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table IN ('stripe_customers', 'users');

-- Test trigger manually
INSERT INTO stripe_customers (user_id, customer_id) 
VALUES ('test-id', 'cus_manual_test');
```
**Fix:** Run new migration to add missing triggers

### Scenario 4: Login Fails After Purchase
**Symptoms:** Account created but login doesn't work
**Debug:** 
```sql
-- Check user linkage
SELECT 
    au.email,
    au.id as auth_id,
    sc.user_id as customer_user_id,
    up.user_id as profile_user_id
FROM auth.users au
LEFT JOIN stripe_customers sc ON au.id = sc.user_id  
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email = 'newtest@kongmindset.se';
```

## 🎯 TEST EXECUTION PLAN

### Phase 1: Pre-Test (2 minutes)
1. Note current row counts in all tables
2. Open monitoring tabs in Supabase
3. Prepare test user credentials

### Phase 2: Purchase Test (3 minutes)
1. Complete purchase flow
2. Monitor tables for updates
3. Check webhook logs for execution

### Phase 3: Verification (2 minutes)
1. Verify all database records created
2. Test login functionality
3. Confirm course access

### Phase 4: Cleanup (1 minute)
1. Delete test user if needed
2. Document results
3. Mark test as success/failure

## 📈 EXPECTED DATABASE STATE AFTER SUCCESS

### Before Test:
```
auth.users: N users
stripe_customers: 3 rows (August data)
user_profiles: M profiles
```

### After Test:
```
auth.users: N+1 users (+ newtest@kongmindset.se)
stripe_customers: 4 rows (+ new customer with proper user_id)
user_profiles: M+1 profiles (+ auto-created profile)
```

### Verification Query:
```sql
-- This should return 1 row with all data linked
SELECT 
    'SUCCESS' as test_result,
    au.email,
    sc.customer_id,
    up.display_name,
    up.created_at as profile_created
FROM auth.users au
JOIN stripe_customers sc ON au.id = sc.user_id
JOIN user_profiles up ON au.id = up.user_id
WHERE au.email = 'newtest@kongmindset.se';
```

## ✅ RUN THIS TEST NOW!

**Execute the test with:**
- Email: `newtest@kongmindset.se`
- Password: `NewTest2025!`

**Report back what happens at each step - this will prove the fixes work! 🚀**