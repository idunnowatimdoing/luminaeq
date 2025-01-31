import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Lock } from "lucide-react";

interface PillarScoreProps {
  title: string;
  currentScore?: number;
  gradientClass: string;
  safeSpaceEntries?: number;
  safeSpaceLimit?: number;
  isSafeSpace?: boolean;
}

const getPillarLevel = (score: number = 0): string => {
  if (score >= 90) return "Advanced";
  if (score >= 75) return "Proficient";
  if (score >= 60) return "Intermediate";
  return "Beginner";
};

const getLevelRange = (score: number = 0): { min: number; max: number } => {
  if (score >= 90) return { min: 90, max: 100 };
  if (score >= 75) return { min: 75, max: 90 };
  if (score >= 60) return { min: 60, max: 75 };
  return { min: 0, max: 60 };
};

const getProgressInCurrentLevel = (score: number = 0): number => {
  const { min, max } = getLevelRange(score);
  return Math.min(100, ((score - min) / (max - min)) * 100);
};

const getNextLevel = (currentLevel: string): string => {
  switch (currentLevel) {
    case "Beginner": return "Intermediate";
    case "Intermediate": return "Proficient";
    case "Proficient": return "Advanced";
    default: return "Mastery";
  }
};

export const PillarScore = ({ 
  title, 
  currentScore, 
  gradientClass,
  safeSpaceEntries,
  safeSpaceLimit,
  isSafeSpace 
}: PillarScoreProps) => {
  const navigate = useNavigate();

  const handlePillarClick = () => {
    const pillarSlug = title.toLowerCase().replace(/ /g, '_');
    navigate(`/journal/${pillarSlug}`);
  };

  const getGeneralTip = (level: string, pillar: string): string => {
    if (level === "Advanced") {
      return `Outstanding ${pillar} skills! Keep inspiring others!`;
    } else if (level === "Proficient") {
      return `Great progress in ${pillar}! Push for excellence!`;
    } else if (level === "Intermediate") {
      return `Growing stronger in ${pillar}! Keep practicing!`;
    }
    return `Start your ${pillar} journey! Every step counts!`;
  };

  return (
    <div 
      className="flex flex-col items-center space-y-4 cursor-pointer group perspective-1000"
      onClick={handlePillarClick}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className={`pillar-orb ${gradientClass} relative`}>
              {isSafeSpace && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white/80" />
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {isSafeSpace ? (
              <p>Private journaling for your eyes only. No AI analysis.</p>
            ) : (
              <p>{title} Level Details</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Card className="w-full journal-card bg-black/40 backdrop-blur-xl border-2 border-gray-700/50">
        <CardHeader className="p-4">
          <CardTitle className="text-base text-white/90 text-center font-semibold">
            {title}
            {isSafeSpace && <Lock className="inline-block ml-2 w-4 h-4" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isSafeSpace ? (
            <div className="flex flex-col text-sm text-center space-y-2">
              {safeSpaceEntries === 0 ? (
                <span className="text-gray-300">Tap to create a private entry</span>
              ) : (
                <>
                  <span className="text-gray-300">{safeSpaceEntries} Entries</span>
                  {safeSpaceLimit && (
                    <span className={safeSpaceEntries >= safeSpaceLimit ? "text-red-500" : "text-gray-400"}>
                      {safeSpaceEntries >= safeSpaceLimit ? 
                        "Monthly limit reached" : 
                        `Available: ${safeSpaceLimit - safeSpaceEntries}`}
                    </span>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-lg font-semibold text-[#00ffd5]">
                  {getPillarLevel(currentScore)}
                </span>
              </div>
              <div className="space-y-1">
                <Progress 
                  value={getProgressInCurrentLevel(currentScore)} 
                  className="h-1.5 bg-gray-700/50"
                />
                <p className="text-xs text-gray-400 text-center">
                  {Math.round(getProgressInCurrentLevel(currentScore))}% to {getNextLevel(getPillarLevel(currentScore))}
                </p>
              </div>
              <p className="text-xs text-gray-300 text-center italic">
                {getGeneralTip(getPillarLevel(currentScore), title)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};