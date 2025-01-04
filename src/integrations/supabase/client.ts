import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eyhirhsyquyysibeieas.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aGlyaHN5cXV5eXNpYmVpZWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4MDg2MzQsImV4cCI6MjA0OTM4NDYzNH0.atTogyzu8Eb40QgzyKUxRUPbJEP-h6bJnjqddYrGfRI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});