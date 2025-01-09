import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PillarScoreProps {
  title: string;
  currentScore?: number;
  goalScore?: number;
  gradientClass: string;
  safeSpaceEntries?: number;
  safeSpaceLimit?: number;
  isSafeSpace?: boolean;
}

export const PillarScore = ({ 
  title, 
  currentScore, 
  goalScore, 
  gradientClass,
  safeSpaceEntries,
  safeSpaceLimit,
  isSafeSpace 
}: PillarScoreProps) => (
  <div className="flex flex-col items-center space-y-4">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`pillar-orb ${gradientClass}`} />
        </TooltipTrigger>
        <TooltipContent>
          {isSafeSpace ? (
            <p>Private journaling for your eyes only. No AI analysis.</p>
          ) : (
            <p>{title} Score Details</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    
    <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
      <CardHeader className="p-4">
        <CardTitle className="text-base text-white text-center">{title}</CardTitle>
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
          <div className="flex justify-between text-sm text-gray-300">
            <span>Current: {currentScore}/100</span>
            <span>Goal: {goalScore}/100</span>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);