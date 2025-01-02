import { Question } from "@/pages/assessment/types";
import { calculateScores } from "@/pages/assessment/utils/calculateScores";

export const useAssessmentScores = (responses: { [key: number]: number }, questions: Question[]) => {
  const calculateAssessmentScores = () => {
    console.log("Calculating assessment scores from responses:", responses);
    const { pillarScores, totalScore } = calculateScores(responses, questions);
    console.log("Calculated scores:", { pillarScores, totalScore });
    
    return { pillarScores, totalScore };
  };

  return { calculateAssessmentScores };
};