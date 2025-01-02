import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PillarCardProps {
  title: string;
  currentValue: number;
  goalValue: number;
  gradientClass: string;
}

export const PillarCard = ({ title, currentValue, goalValue, gradientClass }: PillarCardProps) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`pillar-orb ${gradientClass}`} />
      <Card className="w-full bg-glass">
        <CardHeader className="text-center py-2">
          <CardTitle className="text-sm sm:text-lg text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="flex justify-between text-xs sm:text-sm text-gray-300">
            <span>Current: {currentValue}/20</span>
            <span>Goal: {goalValue}/20</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};