import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthOrb } from "@/components/auth/AuthOrb";
import { RadarChart } from "@/components/assessment/RadarChart";
import { PillarCard } from "./results/PillarCard";
import { ResultsHeader } from "./results/ResultsHeader";
import { ResultsNavigation } from "./results/ResultsNavigation";
import { supabase } from "@/integrations/supabase/client";

export const AssessmentResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scores, setScores] = useState({
    totalScore: 0,
    pillarScores: {
      selfAwareness: 0,
      selfRegulation: 0,
      motivation: 0,
      empathy: 0,
      socialSkills: 0
    }
  });

  useEffect(() => {
    if (location.state) {
      const { totalScore, pillarScores } = location.state;
      if (totalScore !== undefined && pillarScores !== undefined) {
        setScores({ totalScore, pillarScores });
        console.log("Initialized scores from navigation state:", { totalScore, pillarScores });
      } else {
        console.log("No assessment data found in navigation state, redirecting to dashboard");
        navigate("/dashboard", { replace: true });
      }
    } else {
      console.log("No state found in location, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }

    // Set up real-time subscription
    const channel = supabase.channel('profile-updates')
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
  }, [location.state, navigate]);

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

  return (
    <div className="min-h-screen bg-[#051527] p-8 relative overflow-hidden">
      <AuthOrb className="opacity-70 left-3/4 top-1/4 scale-150" />
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <ResultsHeader totalScore={scores.totalScore} />

        <Card className="p-6 bg-black/20 border-gray-800">
          <div className="h-[400px]">
            <TooltipProvider>
              <RadarChart data={radarData} />
            </TooltipProvider>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillarDetails.map((pillar) => (
            <PillarCard
              key={pillar.pillar}
              {...pillar}
              onClick={() => {}}
            />
          ))}
        </div>

        <ResultsNavigation />
      </div>
    </div>
  );
};