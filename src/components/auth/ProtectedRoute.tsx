import { Navigate } from "react-router-dom";
import { useAuthState } from "./hooks/useAuthState";
import { AuthErrorComponent } from "./components/AuthError";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading, onboardingCompleted, error } = useAuthState();

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

  if (onboardingCompleted === false && window.location.pathname !== "/assessment") {
    return <Navigate to="/assessment" replace />;
  }

  return <>{children}</>;
};