import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Campground } from '../types/database';

export function useCampground(campgroundId: string) {
  const [campground, setCampground] = useState<Campground | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadCampground() {
      try {
        const { data, error } = await supabase
          .from('campgrounds')
          .select('*')
          .eq('id', campgroundId)
          .single();

        if (error) throw error;
        setCampground(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to load campground'));
      } finally {
        setLoading(false);
      }
    }

    if (campgroundId) {
      loadCampground();
    }
  }, [campgroundId]);

  return { campground, loading, error };
}