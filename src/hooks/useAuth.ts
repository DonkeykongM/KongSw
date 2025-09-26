import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Early return if Supabase is not configured
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    // Get initial session with proper error handling
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Session error:', error)
          setUser(null)
        } else {
          console.log('Initial session:', session?.user?.email || 'no user');
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Failed to get session:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, 'User:', session?.user?.email || 'none')
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        setUser(session?.user ?? null)
        console.log('User signed in:', session?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        setUser(session?.user ?? null)
        console.log('User signed out');
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { 
        error: { 
          message: 'Supabase is not configured. Please click "Connect to Supabase" in the top right corner to set up authentication.' 
        } 
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (err: any) {
      // Handle network/fetch errors specifically
      if (err.message?.includes('Failed to fetch') || err.name === 'TypeError' || err.message?.includes('refresh_token_not_found')) {
        return { 
          error: { 
            message: 'Unable to connect to authentication service. Please ensure your Supabase credentials are configured correctly in the .env file and restart the development server.' 
          } 
        }
      }
      return { 
        error: { 
          message: err.message || 'Unable to connect to authentication service. Please check your internet connection and try again.' 
        } 
      }
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { 
        error: { 
          message: 'Supabase is not configured. Please click "Connect to Supabase" in the top right corner to set up authentication.' 
        } 
      }
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { error }
    } catch (err: any) {
      // Handle network/fetch errors specifically
      if (err.message?.includes('Failed to fetch') || err.name === 'TypeError' || err.message?.includes('refresh_token_not_found')) {
        return { 
          error: { 
            message: 'Unable to connect to authentication service. Please ensure your Supabase credentials are configured correctly in the .env file and restart the development server.' 
          } 
        }
      }
      return { 
        error: { 
          message: err.message || 'Unable to connect to authentication service. Please check your internet connection and try again.' 
        } 
      }
    }
  }

  const signOut = async () => {
    try {
      if (!isSupabaseConfigured) {
        setUser(null)
        return { error: null }
      }
      
      const { error } = await supabase.auth.signOut()
      setUser(null)
      return { error }
    } catch (err) {
      setUser(null)
      return { error: null } // Sign out locally even if remote fails
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}