import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Question } from "@/pages/assessment/types";
import { useAssessmentScores } from "@/hooks/assessment/useAssessmentScores";
import { useProfileUpdate } from "@/hooks/assessment/useProfileUpdate";
import { useResponseSubmission } from "@/hooks/assessment/useResponseSubmission";

interface AssessmentSubmissionProps {
  responses: { [key: number]: number };
  shuffledQuestions: Question[];
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export const useAssessmentSubmission = ({
  responses,
  shuffledQuestions,
  isSubmitting,
  setIsSubmitting,
}: AssessmentSubmissionProps) => {
  const navigate = useNavigate();
  const { calculateAssessmentScores } = useAssessmentScores(responses, shuffledQuestions);
  const { updateProfile } = useProfileUpdate();
  const { submitResponses } = useResponseSubmission();

  const handleSubmitAssessment = async () => {
    if (isSubmitting) {
      console.log("Submission in progress, ignoring request");
      return;
    }

    setIsSubmitting(true);
    console.log("Starting assessment submission with responses:", responses);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("No authenticated user found");
      }
      console.log("User authenticated:", session.user.id);

      const { pillarScores, totalScore } = calculateAssessmentScores();
      
      await submitResponses(session.user.id, responses, shuffledQuestions);
      await updateProfile(session.user.id, { totalScore, ...pillarScores });

      // Navigate to results with state
      navigate("/assessment/results", {
        replace: true,
        state: {
          totalScore,
          pillarScores: {
            selfAwareness: Math.round(pillarScores.selfAwareness),
            selfRegulation: Math.round(pillarScores.selfRegulation),
            motivation: Math.round(pillarScores.motivation),
            empathy: Math.round(pillarScores.empathy),
            socialSkills: Math.round(pillarScores.socialSkills)
          }
        }
      });
    } catch (error: any) {
      console.error("Error saving assessment results:", error);
      toast.error("Failed to save assessment results. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmitAssessment };
};