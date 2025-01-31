import { usePersonalizedTips } from "@/hooks/usePersonalizedTips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const cardClassName = cn(
    "w-full backdrop-blur-lg border-gray-700 transition-all duration-300",
    type === 'strength' 
      ? "bg-gradient-to-br from-green-900/30 to-emerald-900/20 hover:from-green-900/40 hover:to-emerald-900/30"
      : "bg-gradient-to-br from-orange-900/30 to-amber-900/20 hover:from-orange-900/40 hover:to-amber-900/30"
  );

  const iconClassName = "w-5 h-5 inline-block mr-2";

  return (
    <Card className={cardClassName}>
      <CardHeader className="p-3">
        <CardTitle className="text-sm text-white flex items-center">
          {type === 'strength' ? (
            <CheckCircle className={cn(iconClassName, "text-green-400")} />
          ) : (
            <Star className={cn(iconClassName, "text-amber-400")} />
          )}
          {type === 'strength' ? 'Strength Tips' : 'Focus Area Tips'} - {formatPillarName(pillar)}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {tips?.map((tip) => (
          <div 
            key={tip.id} 
            className={cn(
              "p-3 rounded-lg transition-all duration-300",
              type === 'strength' 
                ? "bg-green-950/30 hover:bg-green-950/40" 
                : "bg-orange-950/30 hover:bg-orange-950/40"
            )}
          >
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {tip.description}
            </p>
          </div>
        ))}
        {(!tips || tips.length === 0) && (
          <p className="text-gray-400 text-xs text-center">No tips available at the moment.</p>
        )}
      </CardContent>
    </Card>
  );
};