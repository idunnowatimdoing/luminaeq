import { Button } from "@/components/ui/button";
import { RadarChart } from "@/components/assessment/RadarChart";

interface ResultsSummaryStepProps {
  name: string;
  assessmentScores: {
    total: number;
    selfAwareness: number;
    selfRegulation: number;
    motivation: number;
    empathy: number;
    socialSkills: number;
  };
  onContinue: () => void;
}

export const ResultsSummaryStep = ({
  name,
  assessmentScores,
  onContinue,
}: ResultsSummaryStepProps) => {
  return (
    <div className="w-full max-w-md space-y-6 p-6 rounded-lg bg-card">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Great job, {name}! You've completed the EQ assessment.
        </h2>
        <p className="text-muted-foreground">
          Here's your baseline EQ score, which you can build upon to improve
          self-awareness, communication, and more.
        </p>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-[#00ffd5]">
            {assessmentScores.total}
          </div>
          <div className="text-sm text-muted-foreground">Overall EQ Score</div>
        </div>

        <div className="h-64">
          <RadarChart
            data={[
              { category: "Category 1", value: assessmentScores.selfAwareness },
              { category: "Category 2", value: assessmentScores.selfRegulation },
              { category: "Category 3", value: assessmentScores.motivation },
              { category: "Category 4", value: assessmentScores.empathy },
              { category: "Category 5", value: assessmentScores.socialSkills },
            ]}
          />
        </div>
      </div>

      <Button
        className="w-full bg-[#00ffd5] text-black hover:bg-[#00b4d8]"
        onClick={onContinue}
      >
        Continue to Dashboard
      </Button>
    </div>
  );
};