import { Trophy, Award, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { PillarCard } from "@/components/dashboard/PillarCard";

export default function HomePage() {
  const { dashboardData, loading } = useDashboardData();

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
          <PillarCard
            title="Self Awareness"
            currentValue={dashboardData?.self_awareness || 0}
            goalValue={20}
            gradientClass="gradient-selfawareness"
          />
          <PillarCard
            title="Self Regulation"
            currentValue={dashboardData?.self_regulation || 0}
            goalValue={18}
            gradientClass="gradient-selfregulation"
          />
          <PillarCard
            title="Motivation"
            currentValue={dashboardData?.motivation || 0}
            goalValue={20}
            gradientClass="gradient-motivation"
          />
          <PillarCard
            title="Empathy"
            currentValue={dashboardData?.empathy || 0}
            goalValue={20}
            gradientClass="gradient-empathy"
          />
          <PillarCard
            title="Social Skills"
            currentValue={dashboardData?.social_skills || 0}
            goalValue={19}
            gradientClass="gradient-socialskills"
          />
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