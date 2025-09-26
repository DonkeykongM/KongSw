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
      console.log('⚠️ Supabase not configured - demo mode')
      return { error: { message: 'Supabase inte konfigurerat - kontakta support' } }
    }

    try {
      console.log('🔐 Försöker logga in:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        console.error('❌ Login error:', error)
        
        // Check if user exists in simple_logins table (fallback for users created via webhook)
        if (error.message?.includes('Invalid login credentials')) {
          console.log('🔍 Checking simple_logins table for user...')
          
          const { data: simpleLoginData, error: simpleLoginError } = await supabase
            .from('simple_logins')
            .select('*')
            .eq('email', email.trim())
            .maybeSingle()
          
          if (simpleLoginData && !simpleLoginError) {
            console.log('✅ Found user in simple_logins, creating auth user...')
            
            // Try to create auth user from simple_logins data
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: email.trim(),
              password: password.trim(),
              options: {
                emailRedirectTo: undefined,
                data: {
                  display_name: simpleLoginData.display_name || 'Kursdeltagare'
                }
              }
            })
            
            if (signUpError) {
              console.error('❌ Failed to create auth user:', signUpError)
              return { error: { message: 'Kunde inte skapa användarkonto' } }
            }
            
            console.log('✅ Auth user created, trying login again...')
            
            // Try login again
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email: email.trim(),
              password: password.trim(),
            })
            
            if (retryError) {
              console.error('❌ Retry login failed:', retryError)
              return { error: { message: 'Inloggning misslyckades efter kontoskapande' } }
            }
            
            console.log('✅ Login successful after auth user creation')
            return { data: retryData, error: null }
          }
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