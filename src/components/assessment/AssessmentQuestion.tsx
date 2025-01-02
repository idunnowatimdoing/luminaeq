import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface AssessmentQuestionProps {
  question: string;
  onResponse: (value: number) => void;
  value: number;
}

export const AssessmentQuestion = ({
  question,
  onResponse,
  value,
}: AssessmentQuestionProps) => {
  return (
    <div className="space-y-8 bg-card p-6 rounded-lg shadow-lg">
      <h2 className="text-xl text-center">{question}</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <Slider
            value={[value]}
            onValueChange={(values) => {
              // The Slider component returns an array of values
              const [newValue] = values;
              if (typeof newValue === "number") {
                onResponse(newValue);
              }
            }}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Not at all</span>
            <span>Somewhat</span>
            <span>Very much</span>
          </div>
        </div>

        <Button
          onClick={() => onResponse(value)}
          className="w-full bg-[#00ffd5] text-black hover:bg-[#00b4d8]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};