import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  id: string;
  display_name: string;
  bio: string;
  goals: string;
  favorite_module: string;
  created_at?: string;
  updated_at?: string;
}

export const useProfile = (user: User | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile data
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Initialize default profile
    const defaultProfile: UserProfile = {
      id: user.id,
      display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Användare',
      bio: 'Behärskar Napoleon Hills framgångsprinciper',
      goals: 'Bygger rikedom genom tankesättstransformation',
      favorite_module: 'Önskans kraft'
    };

    if (!isSupabaseConfigured) {
      // Use localStorage if Supabase is not configured
      const savedProfile = localStorage.getItem(`profile_${user.id}`);
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
        } catch {
          setProfile(defaultProfile);
        }
      } else {
        setProfile(defaultProfile);
      }
      setLoading(false);
      return;
    }

    // Fetch profile from Supabase (SECURE METHOD)
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          setError('Kunde inte ladda profil');
          setProfile(defaultProfile);
        } else if (data) {
          setProfile(data);
        } else {
          // No profile exists, create one (trigger should have done this)
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              display_name: defaultProfile.display_name,
              bio: defaultProfile.bio,
              goals: defaultProfile.goals,
              favorite_module: defaultProfile.favorite_module
            }])
            .select()
            .single();

          if (insertError) {
            console.error('Error creating profile:', insertError);
            setProfile(defaultProfile);
          } else {
            setProfile(newProfile);
          }
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setProfile(defaultProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return false;

    const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };

    if (!isSupabaseConfigured) {
      // Save to localStorage if Supabase is not configured
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      return true;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert([updatedProfile]);

      if (error) {
        console.error('Error updating profile:', error);
        setError('Kunde inte spara profil');
        return false;
      }

      setProfile(updatedProfile);
      return true;
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Kunde inte spara profil');
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Lösenordsändring kräver Supabase-konfiguration' } };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      return { error };
    } catch (err: any) {
      return { error: { message: err.message || 'Kunde inte ändra lösenord' } };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    changePassword,
  };
};