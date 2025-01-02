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
    error 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#051527]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00ffd5]" />
      </div>
    );
  }

  if (error) {
    console.error("Auth error:", error);
    return <Navigate to="/auth" replace />;
  }

  if (!session) {
    console.log("No session found, redirecting to auth");
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

  // If onboarding status is explicitly false (not null or undefined)
  if (onboardingCompleted === false) {
    // Allow access to assessment page only if user came from assessment intro
    if (currentPath === "/assessment" && sessionStorage.getItem("startedFromIntro") === "true") {
      return <>{children}</>;
    }
    
    // If user is not on the welcome/onboarding page, redirect them there
    if (currentPath !== "/") {
      console.log("Redirecting to onboarding flow - onboarding not completed");
      return <Navigate to="/" replace />;
    }
  }

  // If onboarding is completed but user tries to access onboarding-related pages
  if (onboardingCompleted === true) {
    if (currentPath === "/assessment" || currentPath === "/") {
      console.log("Onboarding completed, redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};