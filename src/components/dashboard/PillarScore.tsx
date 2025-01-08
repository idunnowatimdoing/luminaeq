import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PillarScoreProps {
  title: string;
  currentScore: number;
  goalScore: number;
  gradientClass: string;
}

export const PillarScore = ({ title, currentScore, goalScore, gradientClass }: PillarScoreProps) => (
  <div className="flex flex-col items-center space-y-4">
    <div className={`pillar-orb ${gradientClass}`} />
    <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
      <CardHeader className="p-4">
        <CardTitle className="text-base text-white text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between text-sm text-gray-300">
          <span>Current: {currentScore}/100</span>
          <span>Goal: {goalScore}/100</span>
        </div>
      </CardContent>
    </Card>
  </div>
);