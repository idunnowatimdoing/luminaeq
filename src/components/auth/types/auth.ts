import type { Session } from "@supabase/supabase-js";

export interface Profile {
  user_id: string;
  onboarding_completed?: boolean;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthState {
  session: Session | null;
  loading: boolean;
  onboardingCompleted: boolean | null;
  error: AuthError | null;
}