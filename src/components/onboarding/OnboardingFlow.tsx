import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WelcomeStep } from "./steps/WelcomeStep";
import { AssessmentIntroStep } from "./steps/AssessmentIntroStep";
import { ResultsSummaryStep } from "./steps/ResultsSummaryStep";

export const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [assessmentScores, setAssessmentScores] = useState<{
    total: number;
    selfAwareness: number;
    selfRegulation: number;
    motivation: number;
    empathy: number;
    socialSkills: number;
  } | null>(null);
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

      console.log("Profile updated successfully");
      navigate("/");
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
    await handleSubmitProfile(); // Wait for profile update to complete
    toast({
      title: "Assessment Skipped",
      description: "You can complete it anytime from the dashboard to unlock tailored insights and suggestions.",
      duration: 6000,
    });
  };

  const handleStartAssessment = () => {
    console.log("Starting assessment...");
    navigate("/assessment");
  };

  const handleCompleteAssessment = async (scores: typeof assessmentScores) => {
    console.log("Assessment completed with scores:", scores);
    setAssessmentScores(scores);
    setStep(3);
  };

  if (step === 1) {
    return (
      <WelcomeStep
        name={name}
        setName={setName}
        ageRange={ageRange}
        setAgeRange={setAgeRange}
        onNext={() => setStep(2)}
      />
    );
  }

  if (step === 2) {
    return (
      <AssessmentIntroStep
        onSkip={handleSkipAssessment}
        onStartAssessment={handleStartAssessment}
      />
    );
  }

  if (step === 3 && assessmentScores) {
    return (
      <ResultsSummaryStep
        name={name}
        assessmentScores={assessmentScores}
        onContinue={handleSubmitProfile}
      />
    );
  }

  return null;
};