import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { OnboardingFlow } from "../onboarding/OnboardingFlow";
import { Session } from "@supabase/supabase-js";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  onboarding_completed: boolean;
  user_id: string;
}

interface AuthError {
  message: string;
  code?: string;
}

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [error, setError] = useState<AuthError | null>(null);

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
          console.log("Fetching profile for user:", session.user.id);
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("user_id", session.user.id)
            .single();
          
          if (profileError) {
            console.error("Profile fetch error:", profileError);
            throw new Error("Failed to fetch user profile");
          }
          
          console.log("Profile data:", profile);
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", { event: _event, session: session?.user?.id });
      setSession(session);
      
      if (session?.user) {
        try {
          console.log("Updating profile state for user:", session.user.id);
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("user_id", session.user.id)
            .single();
          
          if (profileError) {
            console.error("Profile update error:", profileError);
            throw profileError;
          }
          
          console.log("Updated profile data:", profile);
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

    return () => subscription.unsubscribe();
  }, []);

  console.log("Protected route state:", { 
    sessionExists: !!session, 
    loading, 
    onboardingCompleted, 
    error,
    currentPath: window.location.pathname 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#051527]">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full bg-gray-700/50" />
          <Skeleton className="h-32 w-full bg-gray-700/50" />
          <Skeleton className="h-12 w-full bg-gray-700/50" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#051527]">
        <div className="text-center text-red-400">
          <p>Error: {error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
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