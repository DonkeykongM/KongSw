/*
  # Add function to fix user confirmation issues
  
  This function helps fix authentication issues by confirming users
  who have successful purchases but cannot log in.
*/

-- Function to fix user confirmation
CREATE OR REPLACE FUNCTION fix_user_confirmation(user_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Check if user exists and has successful purchase
  IF EXISTS (
    SELECT 1 FROM course_purchases 
    WHERE email = user_email 
    AND payment_status = 'paid'
  ) THEN
    -- Update user confirmation
    UPDATE auth.users 
    SET 
      email_confirmed_at = NOW(),
      confirmed_at = NOW()
    WHERE email = user_email;
    
    -- Return success
    result := json_build_object(
      'success', true,
      'message', 'User confirmation fixed',
      'email', user_email
    );
  ELSE
    -- User not found or no successful purchase
    result := json_build_object(
      'success', false,
      'message', 'User not found or no successful purchase',
      'email', user_email
    );
  END IF;
  
  RETURN result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION fix_user_confirmation(text) TO authenticated, anon;