import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AssessmentScores {
  total: number;
  selfAwareness: number;
  selfRegulation: number;
  motivation: number;
  empathy: number;
  socialSkills: number;
}

export const useOnboarding = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [assessmentScores, setAssessmentScores] = useState<AssessmentScores | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmitProfile = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      
      console.log("Current session user:", user);
      
      if (!user) {
        throw new Error("No user found");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          age_range: ageRange,
          onboarding_completed: true,
          ...(assessmentScores && {
            total_eq_score: assessmentScores.total,
            self_awareness: assessmentScores.selfAwareness,
            self_regulation: assessmentScores.selfRegulation,
            motivation: assessmentScores.motivation,
            empathy: assessmentScores.empathy,
            social_skills: assessmentScores.socialSkills,
          }),
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }

      console.log("Profile updated successfully, navigating to dashboard");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Submit profile error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSkipAssessment = async () => {
    console.log("Skipping assessment...");
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      
      if (!user) {
        throw new Error("No user found");
      }

      console.log("Updating profile with onboarding completed status");
      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          age_range: ageRange,
          onboarding_completed: true,
          total_eq_score: 50 // Default score when skipping assessment
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      console.log("Profile updated successfully, showing toast");
      toast({
        title: "Assessment Skipped",
        description: "You can complete it anytime from the dashboard to unlock tailored insights and suggestions.",
        duration: 6000,
      });
      
      console.log("Navigating to dashboard");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Error skipping assessment:", error);
      toast({
        title: "Error",
        description: "Failed to skip assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartAssessment = () => {
    console.log("Starting assessment...");
    sessionStorage.setItem("startedFromIntro", "true");
    navigate("/assessment", { replace: true });
  };

  const handleCompleteAssessment = (scores: AssessmentScores) => {
    console.log("Assessment completed with scores:", scores);
    setAssessmentScores(scores);
    setStep(3);
  };

  return {
    step,
    setStep,
    name,
    setName,
    ageRange,
    setAgeRange,
    assessmentScores,
    handleSubmitProfile,
    handleSkipAssessment,
    handleStartAssessment,
    handleCompleteAssessment,
  };
};