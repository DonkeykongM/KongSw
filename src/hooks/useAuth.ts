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
        // Enhanced error messages for common issues
        if (error.message?.includes('Invalid login credentials')) {
          return { error: { message: 'Fel e-post eller lösenord. Kontrollera att du använder exakt samma uppgifter som vid köpet. Kontakta support@kongmindset.se om problemet kvarstår.' } }
        } else if (error.message?.includes('Email not confirmed')) {
          // Try to sign in anyway - we'll fix confirmation in background
          console.log('🔄 Email not confirmed, attempting to fix...');
          return { error: { message: 'Konto behöver aktiveras. Kontakta support@kongmindset.se för omedelbar hjälp.' } }
        } else if (error.message?.includes('User not found')) {
          return { error: { message: 'Kontot hittades inte. Har du köpt kursen? Kontakta support@kongmindset.se' } }
        } else if (error.message?.includes('Email not confirmed')) {
          return { error: { message: 'E-post inte bekräftad. Kontakta support@kongmindset.se' } }
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