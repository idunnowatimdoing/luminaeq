import { PillarScores } from "../types";

export const calculateScores = (responses: { [key: number]: number }, questions: any[]) => {
  const pillarScores: PillarScores = {
    selfAwareness: 0,
    selfRegulation: 0,
    motivation: 0,
    empathy: 0,
    socialSkills: 0,
  };

  // Calculate pillar scores - now scaling to 100 instead of 20
  Object.entries(responses).forEach(([questionId, score]) => {
    const question = questions.find(q => q.id === parseInt(questionId));
    if (question) {
      pillarScores[question.pillar as keyof PillarScores] += (score / 100) * 33.33; // Adjusted multiplier for max 100
    }
  });

  // Total score is now sum of all pillars (max 500)
  const totalScore = Math.round(Object.values(pillarScores).reduce((sum, score) => sum + score, 0));
  
  console.log("Calculated scores with new max values:", { pillarScores, totalScore });
  
  return { pillarScores, totalScore };
};