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
          
          {/* Redirect all other routes to home */}
          <Route
            path="*"
            element={
              <Navigate to="/" replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;