/*
  # Clean All Users - Fresh Start

  1. Purpose
    - Remove all existing users from auth.users
    - Remove all user profiles
    - Remove all purchase records
    - Reset database to clean state for testing

  2. Tables Affected
    - auth.users (all users)
    - user_profiles (all profiles)
    - purchase_records (all purchases)

  3. Security
    - This is a complete reset operation
    - Use only for testing/development
*/

-- Remove all user profiles first (due to foreign key constraints)
DELETE FROM public.user_profiles;

-- Remove all purchase records
DELETE FROM public.purchase_records;

-- Remove all users from auth.users (this will cascade to related tables)
DELETE FROM auth.users;

-- Reset any sequences if needed
SELECT setval('auth.users_id_seq', 1, false);

-- Verify cleanup
DO $$
BEGIN
  RAISE NOTICE 'Cleanup completed:';
  RAISE NOTICE 'auth.users count: %', (SELECT COUNT(*) FROM auth.users);
  RAISE NOTICE 'user_profiles count: %', (SELECT COUNT(*) FROM public.user_profiles);
  RAISE NOTICE 'purchase_records count: %', (SELECT COUNT(*) FROM public.purchase_records);
END $$;