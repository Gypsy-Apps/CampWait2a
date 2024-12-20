import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Helper function to check if an error is a Supabase error
export function isSupabaseError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error;
}

// Helper function to get a human-readable error message
export function getErrorMessage(error: unknown): string {
  if (isSupabaseError(error)) {
    return 'Database error occurred. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}