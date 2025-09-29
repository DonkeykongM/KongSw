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
      
      // Try standard Supabase login first
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        console.error('❌ Standard login failed:', error.message)
        
        // If standard login fails, check if user exists in simple_logins table
        // and try to create auth user from webhook data
        if (error.message?.includes('Invalid login credentials')) {
          console.log('🔄 Checking for webhook-created user...');
          
          try {
            // Check if user exists in simple_logins table
            const { data: simpleLoginData, error: simpleLoginError } = await supabase
              .from('simple_logins')
              .select('*')
              .eq('email', email.trim())
              .single();

            if (simpleLoginData && !simpleLoginError) {
              console.log('✅ Found user in simple_logins, creating auth user...');
              
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
                console.error('❌ Failed to create auth user:', signUpError);
                return { error: { message: 'Kunde inte skapa användarkonto. Kontakta support.' } };
              }

              // Now try to sign in again
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim(),
              });

              if (retryError) {
                console.error('❌ Retry login failed:', retryError);
                return { error: { message: 'Inloggning misslyckades efter kontoskapande. Försök igen.' } };
              }

              console.log('✅ Successfully created and logged in user from webhook data');
              return { data: retryData, error: null };
            }
          } catch (webhookError) {
            console.error('❌ Error checking webhook data:', webhookError);
          }
        }
        
        // Provide user-friendly error messages
        let userFriendlyMessage = 'Fel e-post eller lösenord';
        
        if (error.message?.includes('Email not confirmed')) {
          userFriendlyMessage = 'E-post inte bekräftad. Kontrollera din inkorg.';
        } else if (error.message?.includes('Too many requests')) {
          userFriendlyMessage = 'För många försök. Vänta 10 minuter.';
        } else if (error.message?.includes('Invalid login credentials')) {
          userFriendlyMessage = 'Fel e-post eller lösenord. Har du köpt kursen? Kontrollera dina uppgifter eller köp kursen nedan.';
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
    signOut,
    isConfigured: isSupabaseConfigured
  }
}