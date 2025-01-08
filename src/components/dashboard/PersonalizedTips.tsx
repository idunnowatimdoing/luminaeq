import { usePersonalizedTips } from "@/hooks/usePersonalizedTips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PersonalizedTipsProps {
  pillar: string;
  score: number;
  type: 'strength' | 'focus';
}

export const PersonalizedTips = ({ pillar, score, type }: PersonalizedTipsProps) => {
  const { data: tips, isLoading } = usePersonalizedTips(pillar, score);
  
  const formatPillarName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return <Skeleton className="w-full h-24" />;
  }

  return (
    <Card className="w-full bg-gray-800/30 backdrop-blur-lg border-gray-700">
      <CardHeader className="p-3">
        <CardTitle className="text-sm text-white">
          {type === 'strength' ? '💪 Strength Tips' : '🎯 Focus Area Tips'} - {formatPillarName(pillar)}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {tips?.map((tip) => (
          <div key={tip.id} className="p-2 bg-white/5 rounded-lg">
            <p className="text-gray-300 text-xs">{tip.description}</p>
          </div>
        ))}
        {(!tips || tips.length === 0) && (
          <p className="text-gray-400 text-xs text-center">No tips available at the moment.</p>
        )}
      </CardContent>
    </Card>
  );
};