import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true;
    
    // Skip auth if Supabase not configured
    if (!isSupabaseConfigured) {
      console.log('⚠️ Supabase not configured - demo mode')
      if (mounted) {
        setLoading(false)
      }
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        setAuthError(null);
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (mounted) {
          setUser(session?.user || null)
        }
        console.log('👤 Current user:', session?.user?.email || 'None')
      } catch (error) {
        console.error('Session error:', error)
        if (mounted) {
          setUser(null)
          setAuthError('Kunde inte ladda användardata')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email || 'No user')
      
      if (mounted) {
        setUser(session?.user || null)
        setLoading(false)
        setAuthError(null)
      }
    })

    return () => {
      mounted = false;
      subscription.unsubscribe();
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    
    if (!isSupabaseConfigured) {
      console.log('⚠️ Supabase not configured - demo mode')
      return { error: { message: 'Systemet är inte konfigurerat. Kontakta support på support@kongmindset.se' } }
    }

    try {
      console.log('🔐 Attempting login for:', email.trim())
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return { error: { message: 'Ange en giltig e-postadress.' } };
      }
      
      if (password.length < 6) {
        return { error: { message: 'Lösenordet måste vara minst 6 tecken långt.' } };
      }
      
      // Use Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        console.error('❌ Login failed:', error.message)
        
        // Provide user-friendly error messages
        let userFriendlyMessage = 'Fel e-post eller lösenord';
        
        if (error.message?.includes('Email not confirmed')) {
          userFriendlyMessage = 'E-post inte bekräftad. Kontrollera din inkorg.';
        } else if (error.message?.includes('Too many requests')) {
          userFriendlyMessage = 'För många försök. Vänta 10 minuter.';
        } else if (error.message?.includes('Invalid login credentials')) {
          userFriendlyMessage = 'Fel e-post eller lösenord. Kontrollera dina uppgifter.';
        }
        
        return { error: { message: userFriendlyMessage } }
      }

      console.log('✅ Login successful for:', email.trim())
      return { data, error: null }
      
    } catch (err: any) {
      console.error('❌ Login exception:', err)
      return { error: { message: 'Ett fel uppstod vid inloggning. Försök igen.' } }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Systemet är inte konfigurerat. Kontakta support.' } }
    }

    try {
      console.log('📝 Attempting registration for:', email.trim())
      
      // Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return { error: { message: 'Ange en giltig e-postadress.' } };
      }
      
      if (password.length < 6) {
        return { error: { message: 'Lösenordet måste vara minst 6 tecken långt.' } };
      }
      
      if (!name.trim()) {
        return { error: { message: 'Namn krävs för registrering.' } };
      }
      
      // Create user with Supabase Auth - NO EMAIL CONFIRMATION
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          emailRedirectTo: undefined, // No email confirmation
          data: {
            display_name: name.trim(),
            full_name: name.trim()
          }
        }
      })

      if (error) {
        console.error('❌ Registration failed:', error.message)
        
        let userFriendlyMessage = 'Registrering misslyckades';
        
        if (error.message?.includes('already registered')) {
          userFriendlyMessage = 'E-postadressen är redan registrerad. Försök logga in istället.';
        } else if (error.message?.includes('weak password')) {
          userFriendlyMessage = 'Lösenordet är för svagt. Använd ett starkare lösenord.';
        }
        
        return { error: { message: userFriendlyMessage } }
      }

      console.log('✅ Registration successful for:', email.trim())
      return { data, error: null }
      
    } catch (err: any) {
      console.error('❌ Registration exception:', err)
      return { error: { message: 'Ett fel uppstod vid registrering' } }
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
    authError,
    signIn,
    signUp,
    signOut,
    isConfigured: isSupabaseConfigured
  }
}