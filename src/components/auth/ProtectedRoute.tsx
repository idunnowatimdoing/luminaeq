import { Navigate } from "react-router-dom";
import { useAuthState } from "./hooks/useAuthState";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading, onboardingCompleted, error } = useAuthState();
  const currentPath = window.location.pathname;

  console.log("Protected route state:", { 
    sessionExists: !!session, 
    loading, 
    onboardingCompleted, 
    currentPath,
    error,
    sessionData: session
  });

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#051527]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00ffd5]" />
      </div>
    );
  }

  // Handle auth errors
  if (error) {
    console.error("Auth error:", error);
    return <Navigate to="/auth" replace />;
  }

  // Check for valid session
  if (!session?.user) {
    console.log("No valid session found, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }

  // Special case for assessment results page
  if (currentPath === "/assessment/results") {
    const hasAssessmentState = window.history.state?.usr?.totalScore !== undefined;
    if (!hasAssessmentState) {
      console.log("No assessment state found, redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  // Handle onboarding flow
  if (onboardingCompleted === false) {
    if (currentPath === "/assessment" && sessionStorage.getItem("startedFromIntro") === "true") {
      return <>{children}</>;
    }
    
    if (currentPath !== "/onboarding") {
      console.log("Redirecting to onboarding flow - onboarding not completed");
      return <Navigate to="/onboarding" replace />;
    }
  }

  // Redirect completed users from onboarding pages
  if (onboardingCompleted === true) {
    if (currentPath === "/assessment" || currentPath === "/onboarding") {
      console.log("Onboarding completed, redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};