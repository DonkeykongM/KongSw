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
      const { data: loginData, error: loginError } = await supabase
        .from('simple_logins')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (loginError || !loginData) {
        console.error('No login found:', loginError);
        return { 
          error: { 
            message: 'E-post eller lösenord fel. Om du köpt kursen men inte kan logga in, kontakta support@kongmindset.se' 
          } 
        };
      }

      // Simple password check (for demo - in real app use bcrypt)
      if (loginData.password_hash !== password.trim()) {
        return { 
          error: { 
            message: 'Fel lösenord. Kontakta support@kongmindset.se om du glömt ditt lösenord.' 
          } 
        };
      }

      // Update last login
      await supabase
        .from('simple_logins')
        .update({ last_login: new Date().toISOString() })
        .eq('id', loginData.id);

      // Create user from login data
      const simpleUser: SimpleUser = {
        id: loginData.id,
        email: loginData.email,
        name: loginData.display_name || email.split('@')[0],
        created_at: loginData.created_at,
        has_access: loginData.has_course_access || false
      };

      localStorage.setItem('kongmindset_user', JSON.stringify(simpleUser));
      setUser(simpleUser);

      console.log('✅ Login successful for:', email);
      return { user: simpleUser, error: null };

    } catch (error) {
      console.error('Login error:', error);
      return { 
        error: { 
          message: 'Inloggning misslyckades. Försök igen.' 
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
    isConfigured: true
  };
};