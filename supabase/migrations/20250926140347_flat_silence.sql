/*
  # Enkelt kursköp system - KongMindset

  1. Nya tabeller
    - `course_purchases` - Spårar vem som köpt kursen
    - `user_profiles` - Grundläggande användarprofiler
  
  2. Säkerhet
    - RLS aktiverat på alla tabeller
    - Användare kan endast se sina egna data
  
  3. Triggers
    - Automatisk profilskapning när auth user skapas
*/

-- Ta bort befintliga tabeller först
DROP TABLE IF EXISTS stripe_orders CASCADE;
DROP TABLE IF EXISTS stripe_subscriptions CASCADE;  
DROP TABLE IF EXISTS stripe_customers CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Skapa enkel purchases tabell
CREATE TABLE IF NOT EXISTS course_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  stripe_customer_id text,
  stripe_session_id text,
  payment_status text DEFAULT 'pending',
  amount_paid integer, -- in cents
  currency text DEFAULT 'SEK',
  purchased_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Skapa enkel user_profiles tabell
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

-- Aktivera Row Level Security
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies för course_purchases
CREATE POLICY "Användare kan se sina egna köp" 
  ON course_purchases FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- RLS policies för user_profiles  
CREATE POLICY "Användare kan se sin egen profil"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Användare kan uppdatera sin egen profil"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger för att skapa profil när auth user skapas
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger som körs när ny auth user skapas
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Uppdatera updated_at automatiskt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();