import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Question } from "@/pages/assessment/types";
import { calculateScores } from "@/pages/assessment/utils/calculateScores";

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

  const handleSubmitAssessment = async () => {
    if (isSubmitting) {
      console.log("Submission in progress, ignoring request");
      return;
    }

    setIsSubmitting(true);
    console.log("Starting score calculation and submission");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("No authenticated user found");
      }

      const { pillarScores, totalScore } = calculateScores(responses, shuffledQuestions);
      console.log("Calculated scores:", { pillarScores, totalScore });

      const normalizedResponses = Object.entries(responses).map(([questionId, score]) => ({
        user_id: session.user.id,
        question_id: parseInt(questionId),
        score: Math.min(Math.max(Math.round(score), 0), 100),
        pillar: shuffledQuestions.find(q => q.id === parseInt(questionId))?.pillar || '',
      }));

      const { error: responsesError } = await supabase
        .from("assessment_responses")
        .upsert(normalizedResponses, {
          onConflict: 'user_id,question_id',
          ignoreDuplicates: false
        });

      if (responsesError) throw responsesError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          total_eq_score: totalScore,
          self_awareness: Math.round(pillarScores.selfAwareness),
          self_regulation: Math.round(pillarScores.selfRegulation),
          motivation: Math.round(pillarScores.motivation),
          empathy: Math.round(pillarScores.empathy),
          social_skills: Math.round(pillarScores.socialSkills),
          onboarding_completed: true,
        })
        .eq("user_id", session.user.id);

      if (profileError) throw profileError;

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