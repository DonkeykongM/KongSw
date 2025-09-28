import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Skip auth if Supabase not configured
    if (!isSupabaseConfigured) {
      console.log('⚠️ Supabase not configured - demo mode')
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
      
      if (password.length < 8) {
        return { error: { message: 'Lösenordet måste vara minst 8 tecken långt.' } };
      }
      
      // Use Supabase Auth (SECURE METHOD)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        console.error('❌ Login failed:', error.message)
        
        // Provide user-friendly error messages
        let userFriendlyMessage = 'Inloggning misslyckades';
        
        if (error.message?.includes('Email not confirmed')) {
          userFriendlyMessage = 'E-post inte bekräftad. Kontrollera din inkorg för bekräftelselänk.';
        } else if (error.message?.includes('Too many requests')) {
          userFriendlyMessage = 'För många inloggningsförsök. Vänta 10 minuter och försök igen.';
        } else if (error.message?.includes('Invalid login credentials')) {
          userFriendlyMessage = 'Fel e-post eller lösenord. Kontrollera att du använder rätt uppgifter. Om du glömt lösenordet, använd "Glömt lösenord?"-länken.';
        } else if (error.message?.includes('signup disabled')) {
          userFriendlyMessage = 'Registrering är inaktiverad. Kontakta support@kongmindset.se för hjälp.';
        }
        
        return { error: { message: userFriendlyMessage } }
      }

      console.log('✅ Login successful for:', email.trim())
      return { data, error: null }
      
    } catch (err: any) {
      console.error('❌ Login exception:', err)
      
      let errorMessage = 'Ett oväntat fel uppstod vid inloggning';
      
      if (err.message?.includes('fetch')) {
        errorMessage = 'Kunde inte ansluta till servern. Kontrollera din internetanslutning.';
      } else if (err.message?.includes('network')) {
        errorMessage = 'Nätverksfel. Kontrollera din internetanslutning och försök igen.';
      }
      
      return { error: { message: errorMessage } }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Systemet är inte konfigurerat. Kontakta support på support@kongmindset.se' } }
    }

    try {
      console.log('📝 Attempting registration for:', email.trim())
      
      // Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return { error: { message: 'Ange en giltig e-postadress.' } };
      }
      
      if (password.length < 8) {
        return { error: { message: 'Lösenordet måste vara minst 8 tecken långt.' } };
      }
      
      if (!name.trim()) {
        return { error: { message: 'Namn krävs för registrering.' } };
      }
      
      // Create user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
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
          userFriendlyMessage = 'Lösenordet är för svagt. Använd ett starkare lösenord med stor/liten bokstav, siffra och specialtecken.';
        } else if (error.message?.includes('signup disabled')) {
          userFriendlyMessage = 'Registrering är inaktiverad. Kontakta support@kongmindset.se för hjälp.';
        }
        
        return { error: { message: userFriendlyMessage } }
      }

      console.log('✅ Registration successful for:', email.trim())
      return { data, error: null }
      
    } catch (err: any) {
      console.error('❌ Registration exception:', err)
      return { error: { message: 'Ett oväntat fel uppstod vid registrering' } }
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
    signUp,
    signOut,
    isConfigured: isSupabaseConfigured
  }
}