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
        console.log("Initializing assessment...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, redirecting to auth");
          navigate("/auth", { replace: true });
          return;
        }

        console.log("Fetching profile data...");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
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

        onInitialized();
      } catch (error: any) {
        console.error("Error initializing assessment:", error);
        toast.error("Failed to initialize assessment. Please try again.");
      }
    };

    initializeAssessment();
  }, [navigate, onInitialized]);

  return null;
};