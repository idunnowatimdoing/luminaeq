import { Trophy, Award, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { PillarCard } from "@/components/dashboard/PillarCard";
import Orb from "@/components/orb";

export default function HomePage() {
  const { dashboardData, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#051527] p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <Skeleton className="h-20 w-full max-w-md mx-auto" />
          <div className="flex justify-center">
            <Skeleton className="w-32 h-32 sm:w-48 sm:h-48 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#051527] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Welcome Message */}
        <div className="text-center text-white">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {dashboardData?.name || 'User'}</h1>
          <h2 className="text-base sm:text-lg mt-2">Your Total EQ Score</h2>
        </div>

        {/* Main EQ Score Orb */}
        <div className="flex justify-center">
          <div className="main-orb">
            <span className="text-2xl sm:text-4xl font-bold text-white">
              {dashboardData?.current_eq_score || 0}/100
            </span>
          </div>
        </div>

        {/* Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-8">
          <PillarCard
            title="Self Awareness"
            currentValue={dashboardData?.self_awareness || 0}
            goalValue={20}
            gradientClass="gradient-selfawareness"
          >
            <Orb size="80px" color="#FF6F61" glow={true} />
          </PillarCard>
          <PillarCard
            title="Self Regulation"
            currentValue={dashboardData?.self_regulation || 0}
            goalValue={18}
            gradientClass="gradient-selfregulation"
          >
            <Orb size="80px" color="#6BCB77" glow={true} />
          </PillarCard>
          <PillarCard
            title="Motivation"
            currentValue={dashboardData?.motivation || 0}
            goalValue={20}
            gradientClass="gradient-motivation"
          >
            <Orb size="80px" color="#4F86F7" glow={true} />
          </PillarCard>
          <PillarCard
            title="Empathy"
            currentValue={dashboardData?.empathy || 0}
            goalValue={20}
            gradientClass="gradient-empathy"
          >
            <Orb size="80px" color="#FFD700" glow={true} />
          </PillarCard>
          <PillarCard
            title="Social Skills"
            currentValue={dashboardData?.social_skills || 0}
            goalValue={19}
            gradientClass="gradient-socialskills"
          >
            <Orb size="80px" color="#A020F0" glow={true} />
          </PillarCard>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="w-full bg-glass flex flex-col items-center space-y-4 p-4 sm:p-6">
            <div className="feature-orb">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base sm:text-lg text-white">Challenges</h3>
          </Card>
          <Card className="w-full bg-glass flex flex-col items-center space-y-4 p-4 sm:p-6">
            <div className="feature-orb">
              <Award className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base sm:text-lg text-white">Badges</h3>
          </Card>
          <Card className="w-full bg-glass flex flex-col items-center space-y-4 p-4 sm:p-6">
            <div className="feature-orb">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base sm:text-lg text-white">Learning</h3>
          </Card>
          <Card className="w-full bg-glass flex flex-col items-center space-y-4 p-4 sm:p-6">
            <div className="feature-orb">
              <Users className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base sm:text-lg text-white">LuminaConnect</h3>
            <p className="text-sm sm:text-base text-gray-300">Coming Soon</p>
          </Card>
        </div>

        {/* EQ Insights */}
        <Card className="w-full bg-glass rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-white">EQ Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base text-gray-300">
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
