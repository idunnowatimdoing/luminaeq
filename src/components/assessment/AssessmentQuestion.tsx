import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface AssessmentQuestionProps {
  question: string;
  onResponse: (value: number) => void;
  value: number;
  onPrevious: () => void;
  showPrevious: boolean;
}

export const AssessmentQuestion = ({
  question,
  onResponse,
  value,
  onPrevious,
  showPrevious,
}: AssessmentQuestionProps) => {
  // Separate state for slider value to prevent question change on slide
  const [sliderValue, setSliderValue] = useState(value);

  // Update local slider value when prop value changes
  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  return (
    <div className="space-y-8 bg-card/20 backdrop-blur-lg border-white/20 p-8 rounded-lg shadow-lg relative z-10">
      <h2 className="text-xl text-center text-white">{question}</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <Slider
            value={[sliderValue]}
            onValueChange={(values) => {
              const [newValue] = values;
              if (typeof newValue === "number") {
                setSliderValue(newValue);
              }
            }}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-white/60">
            <span>Not at all</span>
            <span>Somewhat</span>
            <span>Very much</span>
          </div>
        </div>

        <div className="flex gap-4">
          {showPrevious && (
            <Button
              onClick={onPrevious}
              variant="outline"
              className="flex-1 bg-white/5 border-white/20 hover:bg-white/10 text-white"
            >
              Previous
            </Button>
          )}
          <Button
            onClick={() => onResponse(sliderValue)}
            className="flex-1 bg-[#00ffd5] text-black hover:bg-[#00b4d8] transition-colors"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};