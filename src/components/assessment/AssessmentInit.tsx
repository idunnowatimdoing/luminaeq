import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AssessmentInitProps {
  onInitialized: () => void;
}

export const AssessmentInit = ({ onInitialized }: AssessmentInitProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAssessment = async () => {
      try {
        // Wait for auth to be ready
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.log("No session found, redirecting to auth");
          navigate("/auth", { replace: true });
          return;
        }

        console.log("Session found:", session.user.id);

        // Fetch profile with proper auth
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

        console.log("Profile data:", profile);
        
        if (profile?.onboarding_completed) {
          console.log("Assessment already completed, redirecting to home");
          navigate('/', { replace: true });
          return;
        }

        console.log("Assessment can be initialized");
        onInitialized();
      } catch (error: any) {
        console.error("Error initializing assessment:", error);
        toast.error("Failed to initialize assessment. Please try again.");
        navigate("/auth", { replace: true });
      }
    };

    initializeAssessment();
  }, [navigate, onInitialized]);

  return null;
};