import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { TotalEQScore } from "@/components/dashboard/TotalEQScore";
import { PillarScores } from "@/components/dashboard/PillarScores";
import { Insights } from "@/components/dashboard/Insights";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { HeaderIcons } from "@/components/dashboard/HeaderIcons";

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

  if (loading) {
    return <div className="p-8"><Skeleton className="w-full h-[600px]" /></div>;
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#051527] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
        <HeaderIcons />
        <WelcomeHeader userName={dashboardData.userName} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          <div className="space-y-4 md:space-y-8">
            <TotalEQScore score={dashboardData.current_eq_score} />
            <PillarScores scores={dashboardData} />
            <Insights />
          </div>
          
          <div className="space-y-4 md:space-y-8">
            <NotificationsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}