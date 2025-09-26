# Manual User Creation for bahkostudi@gmail.com

## Problem
Webhook function not creating users properly after Stripe payment.

## Quick Manual Fix

### Step 1: Create Auth User
Go to Supabase Dashboard → Authentication → Users → Add User:
- Email: `bahkostudi@gmail.com` 
- Password: (set a temporary password that you can share with the user)
- Email Confirm: ✅ (check this box)

### Step 2: Get User ID
After creating the user, copy the User ID (uuid) from the users list.

### Step 3: Create Profile
Go to Table Editor → user_profiles → Insert Row:
- user_id: [paste the User ID from step 2]
- display_name: `bahkostudi`
- bio: `Behärskar Napoleon Hills framgångsprinciper`
- goals: `Bygger rikedom genom tankesättstransformation`
- favorite_module: `Önskans kraft`

### Step 4: Test Login
User can now log in with:
- Email: bahkostudi@gmail.com
- Password: [the password you set in step 1]

## Long-term Fix
The webhook function needs to be updated and deployed to handle this automatically for future purchases.

## Current Status
- ✅ User profiles table exists with correct structure
- ✅ Stripe secrets configured
- ❌ Webhook function not creating users properly
- ❌ bahkostudi@gmail.com user missing from auth.users table