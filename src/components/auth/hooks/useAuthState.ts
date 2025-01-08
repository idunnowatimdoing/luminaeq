import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

interface AuthError {
  message: string;
  code?: string;
}

interface Profile {
  onboarding_completed?: boolean;
}

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const location = useLocation();
  const currentPath = location.pathname;

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    console.log("Fetching profile for user:", userId);
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", userId)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      console.log("Profile fetched successfully:", profile);
      return profile;
    } catch (err) {
      console.error("Profile fetch failed:", err);
      return { onboarding_completed: false };
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...");
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (mounted) {
          console.log("Initial session state:", { 
            hasSession: !!initialSession,
            userId: initialSession?.user?.id 
          });
          
          setSession(initialSession);

          if (initialSession?.user) {
            try {
              const profile = await fetchProfile(initialSession.user.id);
              setOnboardingCompleted(profile?.onboarding_completed ?? false);
            } catch (err) {
              console.error("Initial profile fetch error:", err);
              setOnboardingCompleted(false);
              setError({
                message: "Failed to load user profile",
                code: "PROFILE_FETCH_ERROR"
              });
            }
          } else {
            setOnboardingCompleted(null);
          }
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Auth initialization error:", err);
        if (mounted) {
          setError({
            message: err.message || "An error occurred during authentication",
            code: err.code
          });
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", { event: _event, sessionId: session?.user?.id });
      
      if (mounted) {
        setSession(session);
        
        if (session?.user) {
          try {
            const profile = await fetchProfile(session.user.id);
            setOnboardingCompleted(profile?.onboarding_completed ?? false);
          } catch (err: any) {
            console.error("Profile state update error:", err);
            setOnboardingCompleted(false);
            setError({
              message: "Failed to update profile information",
              code: err.code
            });
          }
        } else {
          setOnboardingCompleted(null);
        }
        setLoading(false);
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    loading,
    error,
    onboardingCompleted,
    currentPath,
    sessionData: session
  };
};