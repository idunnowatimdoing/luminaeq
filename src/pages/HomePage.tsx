import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Award, BookOpen, Users } from "lucide-react";

interface DashboardData {
  current_eq_score: number;
  self_awareness: number;
  self_regulation: number;
  motivation: number;
  empathy: number;
  social_skills: number;
  name?: string;
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const channel = supabase
      .channel('profiles_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setDashboardData({
            current_eq_score: payload.new.total_eq_score || 0,
            self_awareness: payload.new.self_awareness || 0,
            self_regulation: payload.new.self_regulation || 0,
            motivation: payload.new.motivation || 0,
            empathy: payload.new.empathy || 0,
            social_skills: payload.new.social_skills || 0,
            name: payload.new.name,
          });
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
        name: profileData.name,
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
        <div className="text-center text-white space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, {dashboardData?.name || 'User'}</h1>
          <h2 className="text-lg">Your Total EQ Score</h2>
        </div>

        {/* Main EQ Score Orb */}
        <div className="flex justify-center">
          <div className="main-orb">
            <span className="text-4xl font-bold text-white">
              {dashboardData?.current_eq_score || 0}/100
            </span>
          </div>
        </div>

        {/* Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Self Awareness */}
          <div className="flex flex-col items-center">
            <div className="pillar-orb gradient-selfawareness" />
            <h3 className="text-center text-white mt-2">Self Awareness</h3>
            <Card className="w-full bg-glass">
              <CardHeader>
                <CardTitle className="text-lg text-white">Self Awareness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-gray-300">
                  <span>Current: {dashboardData?.self_awareness}/20</span>
                  <span>Goal: 20/20</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Self Regulation */}
          <div className="flex flex-col items-center">
            <div className="pillar-orb gradient-selfregulation" />
            <h3 className="text-center text-white mt-2">Self Regulation</h3>
            <Card className="w-full bg-glass">
              <CardHeader>
                <CardTitle className="text-lg text-white">Self Regulation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-gray-300">
                  <span>Current: {dashboardData?.self_regulation}/20</span>
                  <span>Goal: 18/20</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Motivation */}
          <div className="flex flex-col items-center">
            <div className="pillar-orb gradient-motivation" />
            <h3 className="text-center text-white mt-2">Motivation</h3>
            <Card className="w-full bg-glass">
              <CardHeader>
                <CardTitle className="text-lg text-white">Motivation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-gray-300">
                  <span>Current: {dashboardData?.motivation}/20</span>
                  <span>Goal: 20/20</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Empathy */}
          <div className="flex flex-col items-center">
            <div className="pillar-orb gradient-empathy" />
            <h3 className="text-center text-white mt-2">Empathy</h3>
            <Card className="w-full bg-glass">
              <CardHeader>
                <CardTitle className="text-lg text-white">Empathy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-gray-300">
                  <span>Current: {dashboardData?.empathy}/20</span>
                  <span>Goal: 20/20</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Skills */}
          <div className="flex flex-col items-center">
            <div className="pillar-orb gradient-socialskills" />
            <h3 className="text-center text-white mt-2">Social Skills</h3>
            <Card className="w-full bg-glass">
              <CardHeader>
                <CardTitle className="text-lg text-white">Social Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-gray-300">
                  <span>Current: {dashboardData?.social_skills}/20</span>
                  <span>Goal: 19/20</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Card className="w-full bg-glass flex flex-col items-center space-y-4 p-6">
            <div className="feature-orb">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-lg text-white">Challenges</h3>
          </Card>
          <Card className="w-full bg-glass flex flex-col items-center space-y-4 p-6">
            <div className="feature-orb">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-lg text-white">Badges</h3>
          </Card>
          <Card className="w-full bg-glass flex flex-col items-center space-y-4 p-6">
            <div className="feature-orb">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg text-white">Learning</h3>
          </Card>
          <Card className="w-full bg-glass flex flex-col items-center space-y-4 p-6">
            <div className="feature-orb">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg text-white">LuminaConnect</h3>
            <p className="text-gray-300">Coming Soon</p>
          </Card>
        </div>

        {/* EQ Insights */}
        <Card className="w-full bg-glass rounded-lg shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="text-xl text-white">EQ Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-4 bg-green-500 rounded" />
              <p>Your self-awareness score has increased by 2 points!</p>
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