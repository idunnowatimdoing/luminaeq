import { AssessmentResults } from "@/components/assessment/AssessmentResults";

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
  assessmentScores,
  onContinue,
}: ResultsSummaryStepProps) => {
  return (
    <AssessmentResults
      totalScore={assessmentScores.total}
      pillarScores={assessmentScores}
      onContinue={onContinue}
    />
  );
};