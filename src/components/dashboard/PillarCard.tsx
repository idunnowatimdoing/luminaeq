import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PillarCardProps {
  title: string;
  currentValue: number;
  goalValue: number;
  gradientClass: string;
}

export const PillarCard = ({ title, currentValue, goalValue, gradientClass }: PillarCardProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`pillar-orb ${gradientClass}`} />
      <h3 className="text-center text-white mt-2">{title}</h3>
      <Card className="w-full bg-glass">
        <CardHeader>
          <CardTitle className="text-lg text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-gray-300">
            <span>Current: {currentValue}/20</span>
            <span>Goal: {goalValue}/20</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};