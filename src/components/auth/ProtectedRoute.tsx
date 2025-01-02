import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { OnboardingFlow } from "../onboarding/OnboardingFlow";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session);
        setSession(session);

        if (session) {
          const { data, error } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("user_id", session.user.id)
            .single();
          
          if (error) {
            console.error("Error fetching profile:", error);
          }
          
          console.log("Profile data:", data);
          setOnboardingCompleted(data?.onboarding_completed ?? false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", { event: _event, session });
      setSession(session);
      
      if (session) {
        const { data, error } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("user_id", session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile on auth change:", error);
        }
        
        console.log("Updated profile data:", data);
        setOnboardingCompleted(data?.onboarding_completed ?? false);
      } else {
        setOnboardingCompleted(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log("Protected route state:", { session, loading, onboardingCompleted, path: window.location.pathname });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // Show onboarding only on home route and when onboarding is not completed
  if (window.location.pathname === '/' && onboardingCompleted === false) {
    return <OnboardingFlow />;
  }

  return <>{children}</>;
};