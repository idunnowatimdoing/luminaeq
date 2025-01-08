import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { TotalEQScore } from "@/components/dashboard/TotalEQScore";
import { PillarScores } from "@/components/dashboard/PillarScores";
import { Insights } from "@/components/dashboard/Insights";
import { HeaderIcons } from "@/components/dashboard/HeaderIcons";
import { PersonalizedTips } from "@/components/dashboard/PersonalizedTips";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardData {
  current_eq_score: number;
  self_awareness: number;
  self_regulation: number;
  motivation: number;
  empathy: number;
  social_skills: number;
  userName?: string;
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchDashboardData();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile update received:', payload);
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("total_eq_score, self_awareness, self_regulation, motivation, empathy, social_skills, name")
        .eq("user_id", user.id)
        .single();

      if (profileError) throw profileError;

      setDashboardData({
        current_eq_score: profileData.total_eq_score || 0,
        self_awareness: profileData.self_awareness || 0,
        self_regulation: profileData.self_regulation || 0,
        motivation: profileData.motivation || 0,
        empathy: profileData.empathy || 0,
        social_skills: profileData.social_skills || 0,
        userName: profileData.name
      });
    } catch (error: any) {
      toast({
        title: "Error fetching dashboard data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const findExtremeScores = (data: DashboardData) => {
    const scores = {
      self_awareness: data.self_awareness,
      self_regulation: data.self_regulation,
      motivation: data.motivation,
      empathy: data.empathy,
      social_skills: data.social_skills
    };

    let highestPillar = Object.entries(scores)[0];
    let lowestPillar = Object.entries(scores)[0];

    Object.entries(scores).forEach(([pillar, score]) => {
      if (score > highestPillar[1]) highestPillar = [pillar, score];
      if (score < lowestPillar[1]) lowestPillar = [pillar, score];
    });

    return { highestPillar, lowestPillar };
  };

  if (loading) {
    return <div className="p-8"><Skeleton className="w-full h-[600px]" /></div>;
  }

  if (!dashboardData) {
    return null;
  }

  const { highestPillar, lowestPillar } = findExtremeScores(dashboardData);

  return (
    <div className={`min-h-screen bg-[#051527] ${isMobile ? 'p-4 pb-24' : 'p-8'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        <HeaderIcons />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Total EQ Score Section */}
          <div className="lg:col-span-4">
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-gray-800 h-full">
              <TotalEQScore 
                score={dashboardData.current_eq_score}
                self_awareness={dashboardData.self_awareness}
                self_regulation={dashboardData.self_regulation}
                motivation={dashboardData.motivation}
                empathy={dashboardData.empathy}
                social_skills={dashboardData.social_skills}
              />
            </div>
          </div>

          {/* Pillar Scores and Insights Section */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-gray-800">
              <PillarScores scores={dashboardData} />
            </div>
            
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-gray-800">
              <Insights />
            </div>

            {/* Personalized Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PersonalizedTips 
                pillar={highestPillar[0]}
                score={highestPillar[1]}
                type="strength"
              />
              <PersonalizedTips 
                pillar={lowestPillar[0]}
                score={lowestPillar[1]}
                type="focus"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
