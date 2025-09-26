import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    // Hämta initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        }
      } catch (error) {
        console.error('Session error:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Lyssna på auth förändringar
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event)
      
      if (session?.user) {
        setUser(session.user)
        await loadProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Ladda användarprofil
  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Profile load error:', error)
      } else {
        setProfile(data)
        console.log('✅ Profil laddad för:', data.email)
      }
    } catch (err) {
      console.error('Profile fetch error:', err)
    }
  }

  // Logga in
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Försöker logga in:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        console.error('Login error:', error)
        return { error }
      }

      console.log('✅ Inloggning lyckades för:', email)
      return { data, error: null }
      
    } catch (err: any) {
      console.error('Login exception:', err)
      return { error: { message: 'Inloggning misslyckades' } }
    }
  }

  // Logga ut
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      return { error }
    } catch (err) {
      console.error('Logout error:', err)
      return { error: null }
    }
  }

  // Kontrollera om användaren har kurstillgång
  const hasCourseAccess = () => {
    return profile?.has_course_access === true || false
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signOut,
    hasCourseAccess,
    refreshProfile: () => user && loadProfile(user.id)
  }
}