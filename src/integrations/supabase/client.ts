import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eyhirhsyquyysibeieas.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aGlyaHN5cXV5eXNpYmVpZWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4MDg2MzQsImV4cCI6MjA0OTM4NDYzNH0.atTogyzu8Eb40QgzyKUxRUPbJEP-h6bJnjqddYrGfRI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'eq-app-auth',
    storage: localStorage,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'eq-app'
    }
  }
});

// Log session state changes for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase Auth Event:', event);
  console.log('Session state:', {
    isAuthenticated: !!session?.user,
    userId: session?.user?.id,
    expiresAt: session?.expires_at
  });
});