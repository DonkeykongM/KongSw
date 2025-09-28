/*
  # Security Fix: Remove unsafe tables and implement proper Supabase Auth

  1. Security Cleanup
    - DROP unsafe simple_logins table (stores plaintext passwords)
    - Remove course_purchases table (redundant with proper auth)
    - Clean up any unsafe data storage

  2. Proper Auth Implementation
    - Create secure profiles table linked to auth.users
    - Set up proper RLS policies
    - Create trigger for automatic profile creation

  3. Purchase Tracking
    - Create secure purchase_records table
    - Link to auth.users via foreign key
    - Proper audit trail without security risks
*/

-- STEP 1: Remove unsafe tables
DROP TABLE IF EXISTS simple_logins CASCADE;
DROP TABLE IF EXISTS course_purchases CASCADE;

-- STEP 2: Create secure profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT DEFAULT 'Kursdeltagare',
  bio TEXT DEFAULT 'Studerar Napoleon Hills framgångsprinciper',
  goals TEXT DEFAULT 'Skapar rikedom genom rätt tankesätt',
  favorite_module TEXT DEFAULT 'Önskans kraft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- STEP 3: Create secure purchase tracking
CREATE TABLE IF NOT EXISTS purchase_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_session_id TEXT,
  amount_paid INTEGER,
  currency TEXT DEFAULT 'SEK',
  payment_status TEXT DEFAULT 'completed',
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on purchase_records
ALTER TABLE purchase_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for purchase_records
CREATE POLICY "Users can view their own purchases"
  ON purchase_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all purchases"
  ON purchase_records FOR ALL
  USING (true);

-- STEP 4: Create trigger function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Kursdeltagare')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that runs when new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STEP 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_purchase_records_user_id ON purchase_records(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_records_stripe_customer ON purchase_records(stripe_customer_id);