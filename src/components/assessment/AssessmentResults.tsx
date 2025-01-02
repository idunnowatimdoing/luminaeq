import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthOrb } from "@/components/auth/AuthOrb";
import { RadarChart } from "@/components/assessment/RadarChart";
import { Card } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PillarCard } from "./results/PillarCard";
import { supabase } from "@/integrations/supabase/client";

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

const getTotalLevel = (score: number): string => {
  if (score >= 90) return "Advanced";
  if (score >= 75) return "Proficient";
  if (score >= 60) return "Intermediate";
  return "Beginner";
};

export const AssessmentResults = ({ 
  totalScore: initialTotalScore, 
  pillarScores: initialPillarScores,
  onContinue 
}: AssessmentResultsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scores, setScores] = useState({
    totalScore: initialTotalScore,
    pillarScores: initialPillarScores
  });

  useEffect(() => {
    if (location.state) {
      const { totalScore, pillarScores } = location.state;
      setScores({ totalScore, pillarScores });
      console.log("Initialized scores from navigation state:", { totalScore, pillarScores });
    }

    const channel = supabase
      .channel('profile-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          console.log("Received real-time profile update:", payload);
          const { new: newProfile } = payload;
          
          if (newProfile) {
            setScores({
              totalScore: newProfile.total_eq_score || 0,
              pillarScores: {
                selfAwareness: newProfile.self_awareness || 0,
                selfRegulation: newProfile.self_regulation || 0,
                motivation: newProfile.motivation || 0,
                empathy: newProfile.empathy || 0,
                socialSkills: newProfile.social_skills || 0
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [location.state]);

  const pillarDetails = [
    {
      pillar: "Self-Awareness",
      score: scores.pillarScores.selfAwareness,
      description: "Your ability to recognize and understand your own emotions",
      strengths: "You show good awareness of your emotional states",
      improvements: "Practice daily emotion journaling to deepen your self-understanding"
    },
    {
      pillar: "Self-Regulation",
      score: scores.pillarScores.selfRegulation,
      description: "Your ability to manage and control your emotions",
      strengths: "You demonstrate control over emotional responses",
      improvements: "Try mindfulness exercises to enhance emotional control"
    },
    {
      pillar: "Motivation",
      score: scores.pillarScores.motivation,
      description: "Your drive to pursue goals and overcome challenges",
      strengths: "You show strong initiative and persistence",
      improvements: "Set specific, measurable goals to maintain momentum"
    },
    {
      pillar: "Empathy",
      score: scores.pillarScores.empathy,
      description: "Your ability to understand others' emotions",
      strengths: "You demonstrate understanding of others' perspectives",
      improvements: "Practice active listening to deepen empathetic connections"
    },
    {
      pillar: "Social Skills",
      score: scores.pillarScores.socialSkills,
      description: "Your ability to build and maintain relationships",
      strengths: "You show effectiveness in social interactions",
      improvements: "Focus on developing conflict resolution techniques"
    }
  ];

  const radarData = pillarDetails.map(detail => ({
    category: detail.pillar,
    value: detail.score
  }));

  const handleGoToDashboard = () => {
    console.log("Navigating to dashboard...");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#051527] p-8 relative overflow-hidden">
      <AuthOrb className="opacity-70 left-3/4 top-1/4 scale-150" />
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Your EQ Assessment Results</h1>
          <p className="text-lg text-gray-300">
            Congratulations! Here's a breakdown of your emotional intelligence across five key pillars.
          </p>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-5xl font-bold text-[#00ffd5]">{scores.totalScore}</span>
            <span className="text-xl text-gray-300">Overall EQ Score - {getTotalLevel(scores.totalScore)}</span>
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

        {/* Pillar Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillarDetails.map((pillar) => (
            <PillarCard
              key={pillar.pillar}
              {...pillar}
              onClick={() => {}}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8">
          <Button
            onClick={handleGoToDashboard}
            className="bg-[#00ffd5] text-black hover:bg-[#00b4d8] transition-colors"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => navigate("/assessment")}
            variant="outline"
            className="bg-white/10 text-white hover:bg-white/20 border-gray-600"
          >
            Retake Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};
