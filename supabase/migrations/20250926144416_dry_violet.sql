/*
# Fix webhook triggers and user creation system

1. Tables
   - Ensure course_purchases and user_profiles exist with correct structure
   - Add proper indexes and constraints

2. Triggers  
   - Auto-create profiles when users are created
   - Handle edge cases and race conditions

3. Security
   - Proper RLS policies for both tables
   - Secure user data access
*/

-- Ensure course_purchases table exists with correct structure
CREATE TABLE IF NOT EXISTS course_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  stripe_customer_id text,
  stripe_session_id text,
  payment_status text DEFAULT 'pending',
  amount_paid integer,
  currency text DEFAULT 'SEK',
  purchased_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Ensure user_profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text DEFAULT 'Kursdeltagare',
  bio text DEFAULT 'Studerar Napoleon Hills framgångsprinciper',
  goals text DEFAULT 'Skapar rikedom genom rätt tankesätt',
  favorite_module text DEFAULT 'Önskans kraft',
  has_course_access boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY IF NOT EXISTS "Users can see own purchases"
  ON course_purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can see own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to auto-create user profile when auth user is created
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id,
    email,
    display_name,
    bio,
    goals,
    favorite_module,
    has_course_access
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'Behärskar Napoleon Hills framgångsprinciper',
    'Bygger rikedom genom tankesättstransformation',
    'Önskans kraft',
    true
  ) ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS auto_create_profile_for_new_user ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER auto_create_profile_for_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_course_purchases_user_id ON course_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_email ON course_purchases(email);
CREATE INDEX IF NOT EXISTS idx_course_purchases_stripe_session ON course_purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);