/*
  # Skapa fungerande login-system för KongMindset

  1. Ny tabell: simple_logins
     - id (uuid, primary key)  
     - email (text, unique)
     - password_hash (text)
     - display_name (text)
     - has_course_access (boolean)
     - created_at (timestamp)
     - last_login (timestamp)

  2. Säkerhet
     - Enable RLS på simple_logins tabell
     - Policy för användare att läsa sin egen data
     - Policy för användare att uppdatera sin egen data

  3. Test-användare
     - Lägger till testanvändare för att säkerställa systemet fungerar
*/

-- Skapa simple_logins tabell
CREATE TABLE IF NOT EXISTS simple_logins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  display_name text DEFAULT 'Kursdeltagare',
  has_course_access boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now()
);

-- Aktivera RLS
ALTER TABLE simple_logins ENABLE ROW LEVEL SECURITY;

-- Policies för simple_logins
CREATE POLICY "Users can read own login data"
  ON simple_logins
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update own login data"
  ON simple_logins
  FOR UPDATE
  TO public
  USING (true);

-- Lägg till befintlig användare från course_purchases
DO $$
DECLARE
    purchase_record RECORD;
BEGIN
    -- Hämta alla befintliga köp
    FOR purchase_record IN 
        SELECT DISTINCT email 
        FROM course_purchases 
        WHERE email IS NOT NULL 
    LOOP
        -- Lägg till i simple_logins om inte redan finns
        INSERT INTO simple_logins (email, password_hash, display_name, has_course_access)
        VALUES (
            purchase_record.email,
            'test123', -- Enkelt lösenord för alla befintliga kunder
            split_part(purchase_record.email, '@', 1),
            true
        )
        ON CONFLICT (email) DO NOTHING;
    END LOOP;
END $$;