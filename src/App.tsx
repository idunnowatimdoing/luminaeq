import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { AssessmentPage } from "./pages/assessment/AssessmentPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    // Check session and onboarding status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("user_id", session.user.id)
          .single();
        
        setOnboardingCompleted(data?.onboarding_completed ?? false);
      }
      setLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // Re-check onboarding status when auth state changes
        supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data }) => {
            setOnboardingCompleted(data?.onboarding_completed ?? false);
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log("Auth state:", { session, loading, onboardingCompleted });

  if (loading) {
    return <div>Loading...</div>;
  }

  // If no session, redirect to auth
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // If not completed onboarding, show onboarding flow
  if (!onboardingCompleted) {
    return <OnboardingFlow />;
  }

  // If authenticated and completed onboarding, show requested page
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth page is public */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <AssessmentPage />
              </ProtectedRoute>
            }
          />
          
          {/* Redirect all other routes to auth if not logged in, or home if logged in */}
          <Route
            path="*"
            element={
              <Navigate to="/auth" replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;