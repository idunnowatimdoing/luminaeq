import { PillarScores } from "../types";

export const calculateScores = (responses: { [key: number]: number }, questions: any[]) => {
  const pillarScores: PillarScores = {
    selfAwareness: 0,
    selfRegulation: 0,
    motivation: 0,
    empathy: 0,
    socialSkills: 0,
  };

  // Calculate pillar scores - now scaled to max 100 per pillar
  Object.entries(responses).forEach(([questionId, score]) => {
    const question = questions.find(q => q.id === parseInt(questionId));
    if (question) {
      // Multiply by 33.33 instead of 6.67 to get to 100 max per pillar
      pillarScores[question.pillar as keyof PillarScores] += (score / 100) * 33.33;
    }
  });

  // Total score is now out of 500 (sum of all pillar scores)
  const totalScore = Math.round(Object.values(pillarScores).reduce((sum, score) => sum + score, 0));
  
  console.log("Calculated scores with new ranges:", { pillarScores, totalScore });
  
  return { pillarScores, totalScore };
};