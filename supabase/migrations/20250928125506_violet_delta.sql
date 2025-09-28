/*
  # Fix User Visibility in Table Editor
  
  1. Problem
    - RLS policies kan blockera visning av användare i Table Editor
    - Service role behöver kunna se alla användare
    
  2. Solution
    - Lägg till policies för service role
    - Säkerställ att Table Editor kan visa data
*/

-- Lägg till policy för service role att se alla användare
CREATE POLICY "Service role can view all user profiles"
  ON user_profiles
  FOR SELECT
  TO service_role
  USING (true);

-- Lägg till policy för service role att se alla köp
CREATE POLICY "Service role can view all purchases"
  ON purchase_records
  FOR SELECT
  TO service_role
  USING (true);

-- Lägg till policy för anon att se profiler (för Table Editor)
CREATE POLICY "Allow table editor to view profiles"
  ON user_profiles
  FOR SELECT
  TO anon
  USING (true);

-- Lägg till policy för anon att se köp (för Table Editor)
CREATE POLICY "Allow table editor to view purchases"
  ON purchase_records
  FOR SELECT
  TO anon
  USING (true);

-- Kontrollera att policies är aktiva
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'purchase_records')
ORDER BY tablename, policyname;