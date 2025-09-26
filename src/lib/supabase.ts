import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          stripe_price_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price: number;
          stripe_price_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          stripe_price_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string;
          email: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name: string;
          email: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string;
          email?: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          stripe_payment_intent_id: string;
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          stripe_payment_intent_id: string;
          amount: number;
          currency: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          stripe_payment_intent_id?: string;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};