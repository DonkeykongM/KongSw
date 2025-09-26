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
      
      // Try direct login first
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        console.error('❌ Direct login failed:', error.message)
        
        // If login fails, check if user exists in simple_logins (webhook created users)
        if (error.message?.includes('Invalid login credentials')) {
          console.log('🔍 Checking simple_logins for webhook-created user...')
          
          try {
            const { data: simpleLoginData, error: simpleLoginError } = await supabase
              .from('simple_logins')
              .select('*')
              .eq('email', email.trim())
              .maybeSingle()
            
            if (simpleLoginData && !simpleLoginError) {
              console.log('✅ Found user in simple_logins:', simpleLoginData.email)
              
              // User exists in simple_logins but not in auth.users
              // This means webhook created the user but auth creation might have failed
              console.log('🔧 Attempting to create missing auth user...')
              
              // Try to create the auth user with the provided password
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: email.trim(),
                password: password.trim(),
                options: {
                  emailRedirectTo: undefined,
                  data: {
                    display_name: simpleLoginData.display_name || 'Kursdeltagare',
                    stripe_customer_id: simpleLoginData.stripe_customer_id,
                    purchase_date: simpleLoginData.purchase_date
                  }
                }
              })
              
              if (signUpError) {
                console.error('❌ Auth user creation failed:', signUpError.message)
                
                if (signUpError.message?.includes('already registered')) {
                  // User exists in auth but password is wrong
                  return { error: { message: 'Fel lösenord. Kontrollera att du använder samma lösenord som vid köpet.' } }
                }
                
                return { error: { message: 'Kunde inte skapa användarkonto. Kontakta support.' } }
              }
              
              if (signUpData.user) {
                console.log('✅ Auth user created from simple_logins data')
                
                // Create user profile if it doesn't exist
                const { error: profileError } = await supabase
                  .from('user_profiles')
                  .upsert({
                    user_id: signUpData.user.id,
                    email: email.trim(),
                    display_name: simpleLoginData.display_name || 'Kursdeltagare',
                    bio: 'Behärskar Napoleon Hills framgångsprinciper',
                    goals: 'Bygger rikedom genom tankesättstransformation',
                    favorite_module: 'Önskans kraft',
                    purchase_date: simpleLoginData.purchase_date,
                    stripe_customer_id: simpleLoginData.stripe_customer_id
                  })
                
                if (profileError) {
                  console.error('❌ Profile creation failed:', profileError)
                } else {
                  console.log('✅ User profile created/updated')
                }
                
                // Now try to login again
                const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                  email: email.trim(),
                  password: password.trim(),
                })
                
                if (retryError) {
                  console.error('❌ Retry login failed:', retryError)
                  return { error: { message: 'Inloggning misslyckades efter kontoskapande. Försök igen.' } }
                }
                
                console.log('✅ Login successful after auth user creation')
                return { data: retryData, error: null }
              }
            } else {
              console.log('❌ User not found in simple_logins table')
              return { error: { message: 'Användare hittades inte. Kontrollera att du har köpt kursen eller kontakta support.' } }
            }
          } catch (fallbackError) {
            console.error('❌ Fallback check failed:', fallbackError)
            return { error: { message: 'Inloggning misslyckades. Kontakta support.' } }
          }
        }
        
        return { error: { message: error.message || 'Inloggning misslyckades' } }
      }

      console.log('✅ Direct login successful:', email)
      return { data, error: null }
      
    } catch (err: any) {
      console.error('❌ Login exception:', err)
      return { error: { message: 'Ett oväntat fel uppstod vid inloggning' } }
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