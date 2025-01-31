import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  return (
    <div 
      className="flex flex-col items-center space-y-4 cursor-pointer group perspective-1000"
      onClick={handlePillarClick}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className={`pillar-orb ${gradientClass}`} />
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
          <CardTitle className="text-base text-white/90 text-center font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isSafeSpace ? (
            <div className="flex flex-col text-sm text-gray-300 text-center">
              <span>{safeSpaceEntries} Entries</span>
              {safeSpaceLimit && (
                <span className={safeSpaceEntries >= safeSpaceLimit ? "text-red-500" : ""}>
                  {safeSpaceEntries >= safeSpaceLimit ? 
                    "Monthly limit reached" : 
                    `Available: ${safeSpaceLimit - safeSpaceEntries}`}
                </span>
              )}
            </div>
          ) : (
            <div className="text-center">
              <span className="text-lg font-semibold text-[#00ffd5]">
                {getPillarLevel(currentScore)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};