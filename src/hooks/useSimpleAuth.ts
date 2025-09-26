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
      } catch (error) {
        localStorage.removeItem('kongmindset_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      console.log('🔐 Attempting simple login for:', email);

      if (!isSupabaseConfigured) {
        // Demo mode - just log in anyone
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

      // First, check if user has purchased the course
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('course_purchases')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .eq('payment_status', 'paid')
        .single();

      if (purchaseError || !purchaseData) {
        console.error('No valid purchase found:', purchaseError);
        return { 
          error: { 
            message: 'Ingen köpt kurs hittades för denna e-post. Kontakta support@kongmindset.se' 
          } 
        };
      }

      // If purchase exists, create simple user object
      const simpleUser: SimpleUser = {
        id: purchaseData.user_id || purchaseData.id,
        email: purchaseData.email,
        name: email.split('@')[0],
        created_at: purchaseData.created_at,
        has_access: true
      };

      // Save to localStorage for persistence
      localStorage.setItem('kongmindset_user', JSON.stringify(simpleUser));
      localStorage.setItem('kongmindset_login_password', password); // Store for validation
      setUser(simpleUser);

      console.log('✅ Simple login successful');
      return { user: simpleUser, error: null };

    } catch (error) {
      console.error('Simple auth error:', error);
      return { 
        error: { 
          message: 'Inloggning misslyckades. Kontakta support@kongmindset.se' 
        } 
      };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('kongmindset_user');
      localStorage.removeItem('kongmindset_login_password');
      setUser(null);
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
    isConfigured: true // Always configured since we bypass Supabase Auth
  };
};