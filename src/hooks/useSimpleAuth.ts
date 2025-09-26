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
        // Demo mode - allow any login
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

      // Special handling for Mathias - always allow login
      if (email.toLowerCase().trim() === 'mathias_bahko@hotmail.com') {
        console.log('🎯 Mathias detected - granting access');
        
        const mathiasUser: SimpleUser = {
          id: 'mathias-special-access',
          email: email.toLowerCase().trim(),
          name: 'Mathias',
          created_at: new Date().toISOString(),
          has_access: true
        };

        localStorage.setItem('kongmindset_user', JSON.stringify(mathiasUser));
        setUser(mathiasUser);
        
        return { user: mathiasUser, error: null };
      }

      // For other users, check if they have purchased
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('course_purchases')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .eq('payment_status', 'paid')
        .single();

      if (purchaseError || !purchaseData) {
        console.error('No purchase found:', purchaseError);
        return { 
          error: { 
            message: 'Ingen köpt kurs hittades. Kontakta support@kongmindset.se eller köp kursen först.' 
          } 
        };
      }

      // Create user from purchase data
      const simpleUser: SimpleUser = {
        id: purchaseData.user_id || purchaseData.id,
        email: purchaseData.email,
        name: email.split('@')[0],
        created_at: purchaseData.created_at,
        has_access: true
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