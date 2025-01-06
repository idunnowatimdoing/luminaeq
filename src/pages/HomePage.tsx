import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Fetch profile data including the user's name
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

  return (
    <div className="min-h-screen bg-[#051527] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-white mb-8">
          Welcome back, {dashboardData?.userName || 'User'}
        </h1>

        {/* Main EQ Score Orb */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="main-orb flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {dashboardData?.current_eq_score || 0}/500
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">Your EQ Score</h2>
        </div>

        {/* Pillar Orbs and Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Self Awareness */}
          <div className="flex flex-col items-center space-y-4">
            <div className="pillar-orb gradient-selfawareness" />
            <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-lg text-white">Self Awareness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-gray-300">
                  <span>Current: {dashboardData?.self_awareness}/100</span>
                  <span>Goal: 100/100</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Self Regulation */}
          <div className="flex flex-col items-center space-y-4">
            <div className="pillar-orb gradient-selfregulation" />
            <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-lg text-white">Self Regulation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-gray-300">
                  <span>Current: {dashboardData?.self_regulation}/100</span>
                  <span>Goal: 90/100</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Motivation */}
          <div className="flex flex-col items-center space-y-4">
            <div className="pillar-orb gradient-motivation" />
            <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-lg text-white">Motivation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-gray-300">
                  <span>Current: {dashboardData?.motivation}/100</span>
                  <span>Goal: 100/100</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Empathy */}
          <div className="flex flex-col items-center space-y-4">
            <div className="pillar-orb gradient-empathy" />
            <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-lg text-white">Empathy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-gray-300">
                  <span>Current: {dashboardData?.empathy}/100</span>
                  <span>Goal: 100/100</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Skills */}
          <div className="flex flex-col items-center space-y-4">
            <div className="pillar-orb gradient-socialskills" />
            <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-lg text-white">Social Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-gray-300">
                  <span>Current: {dashboardData?.social_skills}/100</span>
                  <span>Goal: 95/100</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Insights Section */}
        <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">EQ Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-4 bg-green-500 rounded" />
              <p>Your self-awareness score has increased by 10 points!</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-4 bg-orange-500 rounded" />
              <p>You've maintained a 5-day journal entry streak. Great job!</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-4 bg-purple-500 rounded" />
              <p>Try active listening exercises to further improve your empathy score.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}