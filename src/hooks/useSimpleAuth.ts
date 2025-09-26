import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface SimpleUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  has_access: boolean;
}

interface AuthResult {
  user?: SimpleUser;
  error: any;
}

export const useSimpleAuth = () => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('kongmindset_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('✅ Restored user from localStorage:', parsedUser.email);
      } catch (error) {
        localStorage.removeItem('kongmindset_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      console.log('🔐 Attempting login for:', email);

      if (!isSupabaseConfigured) {
        console.log('⚠️ Supabase not configured - using demo mode');
        // Demo mode - simulera inloggning
        const demoUser: SimpleUser = {
          id: 'demo-user',
          email: email,
          name: email.split('@')[0],
          created_at: new Date().toISOString(),
          has_access: true
        };
        
        localStorage.setItem('kongmindset_user', JSON.stringify(demoUser));
        setUser(demoUser);
        
        return { user: demoUser, error: null };
      }

      // Check if user exists in simple_logins table
      console.log('🔍 Checking simple_logins table for:', email);
      
      const { data: loginData, error: loginError } = await supabase
        .from('simple_logins')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      console.log('📊 Query result:', { data: loginData, error: loginError });

      if (loginError) {
        console.error('❌ Database error:', loginError);
        
        if (loginError.code === 'PGRST116') {
          // No rows found
          return { 
            error: { 
              message: 'E-post eller lösenord fel. Om du köpt kursen men inte kan logga in, kontakta support@kongmindset.se' 
            } 
          };
        }
        
        return { 
          error: { 
            message: 'Databasfel. Försök igen eller kontakta support.' 
          } 
        };
      }

      if (!loginData) {
        console.error('❌ No login data found');
        return { 
          error: { 
            message: 'Kontot hittades inte. Kontakta support@kongmindset.se om du köpt kursen.' 
          } 
        };
      }

      // Check password (simple text comparison for now)
      console.log('🔑 Checking password...');
      
      const { data: verifyResult, error: verifyError } = await supabase
        .rpc('verify_simple_login', { 
          input_email: email.toLowerCase().trim(), 
          input_password: password.trim() 
        });

      if (verifyError) {
        console.error('❌ RPC error:', verifyError);
        return { 
          error: { 
            message: 'Inloggningsfel. Försök igen.' 
          } 
        };
      }

      if (!verifyResult.success) {
        console.error('❌ Login failed:', verifyResult.error);
        return { 
          error: { 
            message: verifyResult.error || 'Inloggning misslyckades' 
          } 
        };
      }

      console.log('✅ Login successful via RPC');
      
      // Create user from RPC result
      const simpleUser: SimpleUser = {
        id: verifyResult.user.id,
        email: verifyResult.user.email,
        name: verifyResult.user.display_name || email.split('@')[0],
        created_at: verifyResult.user.created_at,
        has_access: verifyResult.user.has_course_access || false
      };

      localStorage.setItem('kongmindset_user', JSON.stringify(simpleUser));
       setUser(simpleUser);  // This was missing!
      setUser(simpleUser);

      console.log('✅ Login successful for:', email);
      return { user: simpleUser, error: null };

    } catch (error) {
      console.error('🚨 Login exception:', error);
      return { 
        error: { 
          message: 'Inloggning misslyckades. Kontakta support@kongmindset.se för hjälp.' 
        } 
      };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('kongmindset_user');
      setUser(null);
      console.log('🚪 User signed out');
      return { error: null };
    } catch (error) {
      return { error: null };
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    isConfigured: isSupabaseConfigured
  };
};