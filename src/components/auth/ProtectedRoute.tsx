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

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("Initial session check:", { session, error: sessionError });
        
        if (sessionError) {
          throw sessionError;
        }

        setSession(session);

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("user_id", session.user.id)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            throw new Error("Failed to fetch user profile");
          }
          
          console.log("Profile data:", profile);
          setOnboardingCompleted(profile?.onboarding_completed ?? false);
        }
      } catch (err: any) {
        console.error("Error in auth check:", err);
        setError(err.message);
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
      
      if (session?.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("user_id", session.user.id)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile on auth change:", profileError);
            throw profileError;
          }
          
          console.log("Updated profile data:", profile);
          setOnboardingCompleted(profile?.onboarding_completed ?? false);
        } catch (err) {
          console.error("Error updating profile state:", err);
          setError("Failed to update profile information");
        }
      } else {
        setOnboardingCompleted(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log("Protected route state:", { 
    session, 
    loading, 
    onboardingCompleted, 
    error,
    path: window.location.pathname 
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
          <p>Error: {error}</p>
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