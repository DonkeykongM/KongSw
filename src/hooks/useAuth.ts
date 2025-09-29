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

    // Get initial session and set up auth listener
    const getInitialSession = async () => {
      try {
        setAuthError(null);
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (mounted) {
          setUser(session?.user || null)
          setLoading(false)
        }
        console.log('👤 Current user:', session?.user?.email || 'None')
      } catch (error) {
        console.error('Session error:', error)
        if (mounted) {
          setUser(null)
          setAuthError('Kunde inte ladda användardata')
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
        setAuthError(null)
        
        // Only set loading to false after we've processed the auth change
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          setLoading(false)
        }
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
      
      // Basic validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return { error: { message: 'Ange en giltig e-postadress.' } };
      }
      
      if (password.length < 6) {
        return { error: { message: 'Lösenordet måste vara minst 6 tecken långt.' } };
      }
      
      // Try standard Supabase login first
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        console.error('❌ Standard login failed:', error.message)
        
        // If standard login fails, try to find user in simple_logins (webhook created users)
        if (error.message?.includes('Invalid login credentials')) {
          console.log('🔍 Checking simple_logins for webhook-created user...')
          
          try {
            const { data: simpleLoginData, error: simpleLoginError } = await supabase
              .from('simple_logins')
              .select('*')
              .eq('email', email.trim())
              .single();

            if (simpleLoginData && !simpleLoginError) {
              console.log('✅ Found user in simple_logins, creating auth user...')
              
              // Create auth user from simple_logins data
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: email.trim(),
                password: password.trim(),
                options: {
                  data: {
                    display_name: simpleLoginData.name || email.split('@')[0],
                    full_name: simpleLoginData.name || email.split('@')[0]
                  }
                }
              });

              if (signUpError) {
                console.error('❌ Failed to create auth user:', signUpError.message);
                return { error: { message: 'Kunde inte skapa användarkonto. Kontakta support.' } };
              }

              // Now try to sign in again
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim(),
              });

              if (retryError) {
                console.error('❌ Retry login failed:', retryError.message);
                return { error: { message: 'Inloggning misslyckades efter kontoskapande. Försök igen.' } };
              }

              console.log('✅ Successfully created and logged in user from webhook data');
              return { data: retryData, error: null, success: true };
            }
          } catch (webhookError) {
            console.error('❌ Error checking simple_logins:', webhookError);
          }
        }
        
        // Provide user-friendly error messages
        let userFriendlyMessage = 'Fel e-post eller lösenord';
        
        if (error.message?.includes('Email not confirmed')) {
          userFriendlyMessage = 'E-post inte bekräftad. Kontrollera din inkorg.';
        } else if (error.message?.includes('Too many requests')) {
          userFriendlyMessage = 'För många inloggningsförsök. Vänta 10 minuter.';
        } else if (error.message?.includes('Invalid login credentials')) {
          userFriendlyMessage = 'Fel e-post eller lösenord. Kontrollera dina uppgifter eller kontakta support om du köpt kursen.';
        }
        
        return { error: { message: userFriendlyMessage } }
      }

      console.log('✅ Login successful for:', email.trim())
      return { data, error: null, success: true }
      
    } catch (err: any) {
      console.error('❌ Login exception:', err)
      
      let errorMessage = 'Ett oväntat fel uppstod vid inloggning';
      
      if (err.message?.includes('fetch')) {
        errorMessage = 'Kunde inte ansluta till servern. Kontrollera din internetanslutning.';
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
    authError,
    signIn,
    signUp,
    signOut,
    isConfigured: isSupabaseConfigured
  }
}