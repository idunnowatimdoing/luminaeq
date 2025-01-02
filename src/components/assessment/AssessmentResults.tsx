import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthOrb } from "@/components/auth/AuthOrb";
import { RadarChart } from "@/components/assessment/RadarChart";
import { Card } from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PillarScore {
  pillar: string;
  score: number;
  description: string;
  strengths: string;
  improvements: string;
}

interface AssessmentResultsProps {
  totalScore: number;
  pillarScores: {
    selfAwareness: number;
    selfRegulation: number;
    motivation: number;
    empathy: number;
    socialSkills: number;
  };
  onContinue: () => void;
}

const getPillarLevel = (score: number): string => {
  if (score >= 18) return "Advanced";
  if (score >= 15) return "Proficient";
  if (score >= 12) return "Intermediate";
  return "Beginner";
};

const getTotalLevel = (score: number): string => {
  if (score >= 90) return "Advanced";
  if (score >= 75) return "Proficient";
  if (score >= 60) return "Intermediate";
  return "Beginner";
};

export const AssessmentResults = ({ 
  totalScore, 
  pillarScores,
  onContinue 
}: AssessmentResultsProps) => {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  const pillarDetails: PillarScore[] = [
    {
      pillar: "Self-Awareness",
      score: pillarScores.selfAwareness,
      description: "Your ability to recognize and understand your own emotions",
      strengths: "You show good awareness of your emotional states",
      improvements: "Practice daily emotion journaling to deepen your self-understanding"
    },
    {
      pillar: "Self-Regulation",
      score: pillarScores.selfRegulation,
      description: "Your ability to manage and control your emotions",
      strengths: "You demonstrate control over emotional responses",
      improvements: "Try mindfulness exercises to enhance emotional control"
    },
    {
      pillar: "Motivation",
      score: pillarScores.motivation,
      description: "Your drive to pursue goals and overcome challenges",
      strengths: "You show strong initiative and persistence",
      improvements: "Set specific, measurable goals to maintain momentum"
    },
    {
      pillar: "Empathy",
      score: pillarScores.empathy,
      description: "Your ability to understand others' emotions",
      strengths: "You demonstrate understanding of others' perspectives",
      improvements: "Practice active listening to deepen empathetic connections"
    },
    {
      pillar: "Social Skills",
      score: pillarScores.socialSkills,
      description: "Your ability to build and maintain relationships",
      strengths: "You show effectiveness in social interactions",
      improvements: "Focus on developing conflict resolution techniques"
    }
  ];

  const radarData = pillarDetails.map(detail => ({
    category: detail.pillar,
    value: detail.score
  }));

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 bg-[#051527] relative overflow-hidden">
      <AuthOrb className="opacity-70 left-3/4 top-1/4 scale-150" />
      
      <div className="w-full max-w-4xl space-y-8 relative z-10 px-4">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Your EQ Assessment Results</h1>
          <p className="text-lg text-gray-300">
            Congratulations! Here's a breakdown of your emotional intelligence across five key pillars.
          </p>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-5xl font-bold text-[#00ffd5]">{totalScore}</span>
            <span className="text-xl text-gray-300">Overall EQ Score - {getTotalLevel(totalScore)}</span>
          </div>
        </div>

        {/* Radar Chart Section */}
        <Card className="p-6 bg-black/20 border-gray-800">
          <div className="h-[400px]">
            <TooltipProvider>
              <RadarChart data={radarData} />
            </TooltipProvider>
          </div>
        </Card>

        {/* Pillar Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillarDetails.map((pillar) => (
            <Card 
              key={pillar.pillar}
              className="p-6 bg-black/20 border-gray-800 hover:bg-black/30 transition-colors cursor-pointer"
              onClick={() => setSelectedPillar(pillar.pillar)}
            >
              <h3 className="text-xl font-semibold text-white mb-2">{pillar.pillar}</h3>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl font-bold text-[#00ffd5]">{pillar.score}</span>
                <span className="text-gray-400">/ 20</span>
                <span className="text-sm text-gray-400 ml-2">
                  ({getPillarLevel(pillar.score)})
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-4">{pillar.description}</p>
              <div className="space-y-2">
                <p className="text-sm text-green-400">
                  <span className="font-semibold">Strength:</span> {pillar.strengths}
                </p>
                <p className="text-sm text-blue-400">
                  <span className="font-semibold">Focus Area:</span> {pillar.improvements}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4 pt-8">
          <p className="text-lg text-gray-300">
            Ready to start your EQ development journey?
          </p>
          <Button
            onClick={onContinue}
            className="bg-[#00ffd5] text-black hover:bg-[#00b4d8] transition-colors"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};