export interface Question {
  id: number;
  text: string;
  pillar: string;
}

export interface PillarScores {
  selfAwareness: number;
  selfRegulation: number;
  motivation: number;
  empathy: number;
  socialSkills: number;
}