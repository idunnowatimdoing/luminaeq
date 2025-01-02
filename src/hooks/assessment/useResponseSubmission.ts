import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/pages/assessment/types";

interface NormalizedResponse {
  user_id: string;
  question_id: number;
  score: number;
  pillar: string;
}

export const useResponseSubmission = () => {
  const submitResponses = async (
    userId: string,
    responses: { [key: number]: number },
    questions: Question[]
  ) => {
    const normalizedResponses: NormalizedResponse[] = Object.entries(responses).map(([questionId, score]) => ({
      user_id: userId,
      question_id: parseInt(questionId),
      score: Math.min(Math.max(Math.round(score), 0), 100),
      pillar: questions.find(q => q.id === parseInt(questionId))?.pillar || '',
    }));

    console.log("Saving assessment responses:", normalizedResponses);
    
    const { error: responsesError } = await supabase
      .from("assessment_responses")
      .upsert(normalizedResponses, {
        onConflict: 'user_id,question_id',
        ignoreDuplicates: false
      });

    if (responsesError) {
      console.error("Error saving responses:", responsesError);
      throw responsesError;
    }

    console.log("Assessment responses saved successfully");
  };

  return { submitResponses };
};