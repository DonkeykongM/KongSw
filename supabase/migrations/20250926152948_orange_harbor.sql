/*
  # Fixa RLS-policies för simple_logins system

  1. Säkerhet
    - Ta bort gamla policies som använder auth.uid()
    - Skapa nya policies som fungerar med simple_logins
    - Tillåt INSERT, SELECT, UPDATE för användare

  2. Ändringar
    - Uppdaterar user_profiles policies
    - Skapar funktion för att hämta current user från simple_logins
*/

-- Skapa funktion för att hämta aktuell användare från simple_logins
CREATE OR REPLACE FUNCTION get_current_simple_user_id()
RETURNS uuid
LANGUAGE sql
SECURITY definer
STABLE
AS $$
  SELECT id FROM simple_logins 
  WHERE email = current_setting('app.current_user_email', true)
  LIMIT 1;
$$;

-- Ta bort gamla policies
DROP POLICY IF EXISTS "Användare kan se sin egen profil" ON user_profiles;
DROP POLICY IF EXISTS "Användare kan uppdatera sin egen profil" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Skapa nya policies för simple_logins system
CREATE POLICY "Simple users can read own profile"
  ON user_profiles
  FOR SELECT
  TO public
  USING (user_id = get_current_simple_user_id());

CREATE POLICY "Simple users can create own profile"
  ON user_profiles
  FOR INSERT
  TO public
  WITH CHECK (user_id = get_current_simple_user_id());

CREATE POLICY "Simple users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO public
  USING (user_id = get_current_simple_user_id())
  WITH CHECK (user_id = get_current_simple_user_id());

-- Sätt user_email i session för att policies ska fungera
CREATE OR REPLACE FUNCTION set_current_user_email(user_email text)
RETURNS void
LANGUAGE sql
SECURITY definer
AS $$
  SELECT set_config('app.current_user_email', user_email, false);
$$;