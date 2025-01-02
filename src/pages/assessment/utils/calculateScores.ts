import { PillarScores } from "../types";

export const calculateScores = (responses: { [key: number]: number }, questions: any[]) => {
  const pillarScores: PillarScores = {
    selfAwareness: 0,
    selfRegulation: 0,
    motivation: 0,
    empathy: 0,
    socialSkills: 0,
  };

  // Calculate pillar scores
  Object.entries(responses).forEach(([questionId, score]) => {
    const question = questions.find(q => q.id === parseInt(questionId));
    if (question) {
      pillarScores[question.pillar as keyof PillarScores] += (score / 100) * 6.67;
    }
  });

  const totalScore = Math.round(Object.values(pillarScores).reduce((sum, score) => sum + score, 0));
  
  console.log("Calculated scores:", { pillarScores, totalScore });
  
  return { pillarScores, totalScore };
};