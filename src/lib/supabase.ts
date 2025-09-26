import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseAnonKey.includes('placeholder') &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 50

// Create client with proper configuration check
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true, // Enable persistence when configured
        autoRefreshToken: true, // Enable auto refresh when configured
        storage: window.localStorage, // Use localStorage for persistence
        storageKey: 'sb-auth-token',
        flowType: 'pkce'
      }
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })

export { isSupabaseConfigured }