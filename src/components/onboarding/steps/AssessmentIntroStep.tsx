import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AssessmentIntroStepProps {
  onSkip: () => void;
  onStartAssessment: () => void;
}

export const AssessmentIntroStep = ({
  onSkip,
  onStartAssessment,
}: AssessmentIntroStepProps) => {
  return (
    <div className="w-full max-w-md space-y-6 p-6 rounded-lg bg-card">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Let's Get Started with Your EQ Journey
        </h2>
        <p className="text-muted-foreground">
          Lumina works best when it understands you. Let's complete a quick
          Emotional Intelligence (EQ) assessment.
        </p>
        <p className="text-sm text-muted-foreground">
          This involves 15 questions and takes about 5 minutes.
        </p>
        <p className="text-xs text-muted-foreground">
          The assessment is recommended for a tailored experience, but it's not
          required.
        </p>
      </div>

      <div className="space-y-4">
        <Button
          className="w-full bg-[#00ffd5] text-black hover:bg-[#00b4d8]"
          onClick={onStartAssessment}
        >
          Start Assessment
        </Button>
        <Button variant="outline" className="w-full" onClick={onSkip}>
          Skip for Now
        </Button>
      </div>
    </div>
  );
};