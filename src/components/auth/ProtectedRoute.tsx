import { Navigate } from "react-router-dom";
import { useAuthState } from "./hooks/useAuthState";
import { AuthErrorComponent } from "./components/AuthError";

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
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <AuthErrorComponent error={error} />;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // If onboarding is not completed and user is not already in the onboarding flow
  if (onboardingCompleted === false) {
    // Allow access to assessment page only if user came from assessment intro
    if (currentPath === "/assessment" && sessionStorage.getItem("startedFromIntro") === "true") {
      return <>{children}</>;
    }
    
    // If user is not on the welcome page, redirect them there
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