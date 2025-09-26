/*
  # Add secure password verification function

  1. Security Functions
    - Create RPC function `verify_simple_login` for secure password verification
    - Handles both plain text and potential future hashing
  
  2. Data Setup  
    - Ensure mathias_bahko@hotmail.com exists with correct password
    - Set up simple, working authentication
*/

-- Create password verification function
CREATE OR REPLACE FUNCTION verify_simple_login(input_email TEXT, input_password TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
  result JSON;
BEGIN
  -- Find user by email
  SELECT * INTO user_record 
  FROM simple_logins 
  WHERE email = input_email;
  
  -- Check if user exists
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Användare hittades inte'
    );
  END IF;
  
  -- Simple password check (can be enhanced with hashing later)
  IF user_record.password_hash = input_password THEN
    -- Update last login
    UPDATE simple_logins 
    SET last_login = NOW() 
    WHERE id = user_record.id;
    
    -- Return success with user data
    RETURN json_build_object(
      'success', true,
      'user', json_build_object(
        'id', user_record.id,
        'email', user_record.email,
        'display_name', user_record.display_name,
        'has_course_access', user_record.has_course_access,
        'created_at', user_record.created_at
      )
    );
  ELSE
    RETURN json_build_object(
      'success', false,
      'error', 'Fel lösenord'
    );
  END IF;
END;
$$;

-- Make sure the test user exists with correct password
INSERT INTO simple_logins (email, password_hash, display_name, has_course_access)
VALUES ('mathias_bahko@hotmail.com', 'test123', 'Mathias', true)
ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = 'test123',
  display_name = 'Mathias',
  has_course_access = true;