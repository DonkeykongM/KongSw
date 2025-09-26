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

// Create client - always create it, but with different config
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: isSupabaseConfigured, // Only persist if properly configured
    autoRefreshToken: isSupabaseConfigured,
    storage: isSupabaseConfigured ? window.localStorage : undefined,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'kongmindset-web'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

export { isSupabaseConfigured }

// Enhanced configuration logging
if (import.meta.env.DEV) {
  console.log('🔧 Supabase config:', { 
    configured: isSupabaseConfigured, 
    hasUrl: !!supabaseUrl && !supabaseUrl.includes('placeholder'),
    hasKey: !!supabaseAnonKey && !supabaseAnonKey.includes('placeholder'),
    urlFormat: supabaseUrl.startsWith('https://') ? 'valid' : 'invalid',
    keyLength: supabaseAnonKey.length
  });
  
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase not properly configured. Check your .env file.');
    console.warn('Expected format:');
    console.warn('VITE_SUPABASE_URL=https://your-project.supabase.co');
    console.warn('VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  }
}