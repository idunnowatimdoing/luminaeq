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
    console.log("Fetching profile for user:", userId);
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("user_id", userId)
      .single();
    
    if (profileError) {
      console.error("Profile fetch error:", profileError);
      throw new Error("Failed to fetch user profile");
    }
    
    console.log("Profile data:", profile);
    return profile;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Starting auth check...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        console.log("Session status:", session ? "Active" : "No session");
        setSession(session);

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setOnboardingCompleted(profile?.onboarding_completed ?? false);
        }
      } catch (err: any) {
        console.error("Auth check error:", err);
        setError({
          message: err.message || "An error occurred during authentication",
          code: err.code
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", { event: _event, session: session?.user?.id });
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
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading, onboardingCompleted, error };
};