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
      return { error: { message: 'Systemet är inte konfigurerat. Kontakta support på support@kongmindset.se' } }
    }

    try {
      console.log('🔐 Försöker logga in:', email.trim())
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return { error: { message: 'Ange en giltig e-postadress.' } };
      }
      
      if (password.length < 6) {
        return { error: { message: 'Lösenordet måste vara minst 6 tecken långt.' } };
      }
      
      // Try direct login first
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        console.error('❌ Direct login failed:', error.message)
        console.log('🔍 Checking if user exists in simple_logins table...')
        
        // If login fails, check if user exists in simple_logins (webhook created users)
        if (error.message?.includes('Invalid login credentials')) {
          console.log('🔍 User not found in auth.users, checking simple_logins...')
          
          try {
            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 10000)
            );
            
            const queryPromise = supabase
              .from('simple_logins')
              .select('*')
              .eq('email', email.trim())
              .maybeSingle();
            
            const { data: simpleLoginData, error: simpleLoginError } = await Promise.race([
              queryPromise,
              timeoutPromise
            ]) as any;
            
            if (simpleLoginData && !simpleLoginError) {
              console.log('✅ Found user in simple_logins table:', simpleLoginData.email)
              console.log('📊 User data:', {
                email: simpleLoginData.email,
                hasStripeCustomer: !!simpleLoginData.stripe_customer_id,
                purchaseDate: simpleLoginData.purchase_date,
                courseAccess: simpleLoginData.course_access
              })
              
              // User exists in simple_logins but not in auth.users
              // This means webhook created the user but auth creation might have failed
              console.log('🔧 Creating auth user from webhook data...')
              
              // Try to create the auth user with the provided password
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: email.trim(),
                password: password.trim(),
                options: {
                  emailRedirectTo: undefined,
                  data: {
                    display_name: simpleLoginData.display_name || 'Kursdeltagare',
                    stripe_customer_id: simpleLoginData.stripe_customer_id,
                    purchase_date: simpleLoginData.purchase_date,
                    source: 'webhook_recovery'
                  }
                }
              })
              
              if (signUpError) {
                console.error('❌ Auth user creation failed:', signUpError.message)
                console.log('🔍 Error details:', signUpError)
                
                if (signUpError.message?.includes('already registered')) {
                  // User exists in auth but password is wrong
                  return { error: { message: 'Fel lösenord. Använd samma lösenord som du valde vid köpet. Kontakta support@kongmindset.se om du glömt det.' } }
                }
                
                return { error: { message: 'Tekniskt fel vid kontoskapande. Kontakta support@kongmindset.se med din e-post så hjälper vi dig.' } }
              }
              
              if (signUpData.user) {
                console.log('✅ Auth user created successfully from webhook data')
                console.log('👤 New user ID:', signUpData.user.id)
                
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
                  console.log('⚠️ User can still access course without profile')
                } else {
                  console.log('✅ User profile created successfully')
                }
                
                // Now try to login again
                const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                  email: email.trim(),
                  password: password.trim(),
                })
                
                if (retryError) {
                  console.error('❌ Retry login failed after user creation:', retryError)
                  return { error: { message: 'Kontot skapades men inloggning misslyckades. Vänta 1 minut och försök logga in igen.' } }
                }
                
                console.log('✅ Login successful after auth user creation!')
                console.log('🎉 User now has full access to course')
                return { data: retryData, error: null }
              }
            } else {
              console.log('❌ User not found in simple_logins table')
              console.log('🔍 This means user has not completed purchase via webhook')
              return { error: { message: 'Användare hittades inte. Du måste först köpa kursen för att få tillgång. Kontakta support@kongmindset.se om du redan betalat.' } }
            }
          } catch (fallbackError) {
            console.error('❌ Fallback check failed:', fallbackError)
            
            if (fallbackError.message === 'Timeout') {
              return { error: { message: 'Anslutningen tog för lång tid. Kontrollera din internetanslutning och försök igen om 30 sekunder.' } }
            }
            
            return { error: { message: 'Tekniskt fel vid inloggning. Kontakta support@kongmindset.se med din e-post så hjälper vi dig.' } }
          }
        }
        
        // Handle other auth errors
        let userFriendlyMessage = 'Inloggning misslyckades';
        
        if (error.message?.includes('Email not confirmed')) {
          userFriendlyMessage = 'E-post inte bekräftad. Kontrollera din inkorg eller kontakta support@kongmindset.se';
        } else if (error.message?.includes('Too many requests')) {
          userFriendlyMessage = 'För många inloggningsförsök. Vänta 10 minuter och försök igen.';
        } else if (error.message?.includes('Invalid login credentials')) {
          userFriendlyMessage = 'Fel e-post eller lösenord. Använd samma uppgifter som vid köpet. Kontakta support@kongmindset.se om problemet kvarstår.';
        }
        
        return { error: { message: userFriendlyMessage } }
      }

      console.log('✅ Direct login successful for:', email.trim())
      console.log('🎉 User authenticated and has course access')
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