import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthState } from "../types/auth";

export const useAuthState = (): AuthState => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [error, setError] = useState<AuthError | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", userId)
        .single();
      
      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }
      
      console.log("Profile data:", profile);
      return profile;
    } catch (err) {
      console.error("Profile fetch failed:", err);
      throw err;
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log("Starting auth check...");
        // Get the initial session state
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        console.log("Initial session status:", initialSession ? "Active" : "No session");
        
        if (mounted) {
          setSession(initialSession);
          
          if (initialSession?.user) {
            try {
              const profile = await fetchProfile(initialSession.user.id);
              setOnboardingCompleted(profile?.onboarding_completed ?? false);
            } catch (err) {
              console.error("Initial profile fetch error:", err);
              setError({
                message: "Failed to load user profile",
                code: "PROFILE_FETCH_ERROR"
              });
            }
          }
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Auth check error:", err);
        if (mounted) {
          setError({
            message: err.message || "An error occurred during authentication",
            code: err.code
          });
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", { event: _event, session: session?.user?.id });
      
      if (mounted) {
        setSession(session);
        
        if (session?.user) {
          try {
            console.log("Updating profile state for user:", session.user.id);
            const profile = await fetchProfile(session.user.id);
            setOnboardingCompleted(profile?.onboarding_completed ?? false);
          } catch (err: any) {
            console.error("Profile state update error:", err);
            setError({
              message: "Failed to update profile information",
              code: err.code
            });
          }
        } else {
          setOnboardingCompleted(null);
        }
      }
    });

    // Initialize auth state
    checkAuth();

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading, onboardingCompleted, error };
};