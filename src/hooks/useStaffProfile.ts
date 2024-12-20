import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Staff } from '../types/database';

export function useStaffProfile() {
  const { user } = useAuth();
  const [staffProfile, setStaffProfile] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadStaffProfile() {
      try {
        if (!user?.id) return;

        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(); // Use maybeSingle() instead of single()

        if (error) throw error;
        setStaffProfile(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to load staff profile'));
        console.error('Error loading staff profile:', e);
      } finally {
        setLoading(false);
      }
    }

    loadStaffProfile();
  }, [user?.id]); // Depend on user.id instead of user

  return { staffProfile, loading, error };
}