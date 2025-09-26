import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Skip auth if Supabase not configured
    if (!isSupabaseConfigured) {
      console.log('⚠️ Supabase not configured - skipping auth')
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
        console.log('👤 Current user:', session?.user?.email || 'None')
      } catch (error) {
        console.error('Session error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email || 'No user')
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase inte konfigurerat' } }
    }

    try {
      console.log('🔐 Försöker logga in:', email)
      
      // Clear any existing session first
      await supabase.auth.signOut()
      
      // Add a small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        console.error('❌ Login error:', error)
        console.error('Full error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        // If there's an error, try to fix it automatically
        if (error.message?.includes('Email not confirmed') || error.message?.includes('signup_disabled')) {
          console.log('🔄 Trying to fix email confirmation...');
          try {
            // Try to fix the confirmation in the background
            await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/fix_user_confirmation`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
              },
              body: JSON.stringify({ user_email: email.trim() })
            });
            
            // Try login again after fix
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email: email.trim(),
              password: password.trim(),
            });
            
            if (!retryError) {
              console.log('✅ Login succeeded after fix');
              return { data: retryData, error: null };
            }
          } catch (fixError) {
            console.error('Could not auto-fix:', fixError);
          }
        }
        
        // Enhanced error messages
        if (error.message?.includes('Invalid login credentials')) {
          return { error: { message: 'Fel e-post eller lösenord. Om du nyligen köpte kursen, kontakta support@kongmindset.se så fixar vi det direkt.' } }
        } else if (error.message?.includes('Email not confirmed')) {
          return { error: { message: 'E-post behöver bekräftas. Kontakta support@kongmindset.se för omedelbar aktivering.' } }
        } else if (error.message?.includes('User not found')) {
          return { error: { message: 'Kontot hittades inte. Kontakta support@kongmindset.se om du köpt kursen.' } }
        } else if (error.message?.includes('Too many requests')) {
          return { error: { message: 'För många försök. Vänta 1 minut och försök igen.' } }
        }
        return { error }
      }

      console.log('✅ Login success:', email)
      return { data, error: null }
      
    } catch (err: any) {
      console.error('Login exception:', err)
      return { error: { message: 'Inloggning misslyckades' } }
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null)
      return { error: null }
    }

    try {
      const { error } = await supabase.auth.signOut()
      setUser(null)
      return { error }
    } catch (err) {
      console.error('Logout error:', err)
      return { error: null }
    }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    isConfigured: isSupabaseConfigured
  }
}