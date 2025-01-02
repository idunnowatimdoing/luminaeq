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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    console.error("Auth error:", error);
    return <Navigate to="/auth" replace />;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // If onboarding is not completed
  if (onboardingCompleted === false) {
    // Allow access to assessment page only if user came from assessment intro
    if (currentPath === "/assessment" && sessionStorage.getItem("startedFromIntro") === "true") {
      return <>{children}</>;
    }
    
    // If user is not on the welcome/onboarding page, redirect them there
    if (currentPath !== "/") {
      return <Navigate to="/" replace />;
    }
  }

  // If onboarding is completed but user tries to access onboarding-related pages
  if (onboardingCompleted === true && (currentPath === "/assessment" || currentPath === "/")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};