import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { TotalEQScore } from "@/components/dashboard/TotalEQScore";
import { PillarGrid } from "@/components/dashboard/PillarGrid";
import { FeatureGrid } from "@/components/dashboard/FeatureGrid";
import { EQInsights } from "@/components/dashboard/EQInsights";

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
        <TotalEQScore score={dashboardData?.current_eq_score || 0} name={dashboardData?.name} />
        <PillarGrid dashboardData={dashboardData} />
        <FeatureGrid />
        <EQInsights />
      </div>
    </div>
  );
}