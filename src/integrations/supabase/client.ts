import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eyhirhsyquyysibeieas.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aGlyaHN5cXV5eXNpYmVpZWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1MjY4MDAsImV4cCI6MjAyMDEwMjgwMH0.GG5UNWiJV_hX4HGbHgx6O3G6E9kFb-X0u7yXfm-G9Yk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});