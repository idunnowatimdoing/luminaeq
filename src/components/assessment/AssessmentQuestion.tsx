import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AuthOrb } from "@/components/auth/AuthOrb";

interface AssessmentQuestionProps {
  question: string;
  onResponse: (value: number) => void;
  value: number;
  onPrevious: () => void;
  showPrevious: boolean;
  currentQuestion: number;
  totalQuestions: number;
}

export const AssessmentQuestion = ({
  question,
  onResponse,
  value,
  onPrevious,
  showPrevious,
  currentQuestion,
  totalQuestions,
}: AssessmentQuestionProps) => {
  // Separate state for slider value to prevent question change on slide
  const [sliderValue, setSliderValue] = useState(value);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showError, setShowError] = useState(false);

  // Update local slider value when prop value changes
  useEffect(() => {
    setSliderValue(value);
    setHasInteracted(false);
  }, [value]);

  const handleContinue = () => {
    if (!hasInteracted && sliderValue === 50) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    onResponse(sliderValue);
  };

  const isLastQuestion = currentQuestion === totalQuestions;

  return (
    <div className="min-h-screen bg-[#051527] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Positioned orbs */}
      <AuthOrb className="left-2/3 top-1/4 opacity-60" />
      <AuthOrb className="left-1/4 bottom-1/4 opacity-40" />
      
      <div className="w-full max-w-2xl space-y-8 relative z-10">
        <div className="space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <h1 className="text-2xl font-semibold tracking-tight text-center text-white mb-2">
                    Question {currentQuestion} of {totalQuestions}
                  </h1>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00ffd5] transition-all duration-300"
                      style={{
                        width: `${(currentQuestion / totalQuestions) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Progress: {Math.round((currentQuestion / totalQuestions) * 100)}%
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-8 bg-card/20 backdrop-blur-lg border border-white/20 p-8 rounded-lg shadow-lg relative z-10 transition-all duration-300 hover:bg-card/30">
          <h2 className={cn(
            "text-xl text-center text-white transition-all duration-300",
            question.length > 100 ? "text-lg" : "text-xl"
          )}>
            {question}
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <Slider
                value={[sliderValue]}
                onValueChange={(values) => {
                  const [newValue] = values;
                  if (typeof newValue === "number") {
                    setSliderValue(newValue);
                    setHasInteracted(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    setSliderValue((prev) => Math.max(0, prev - 1));
                    setHasInteracted(true);
                  } else if (e.key === "ArrowRight") {
                    setSliderValue((prev) => Math.min(100, prev + 1));
                    setHasInteracted(true);
                  }
                }}
                max={100}
                step={1}
                className={cn(
                  "w-full transition-all duration-300",
                  showError && "animate-shake"
                )}
                aria-label="Response slider"
              />
              <div className="flex justify-between text-sm text-white/60">
                <span>Not at all</span>
                <span>Somewhat</span>
                <span>Very much</span>
              </div>
              {showError && (
                <p className="text-red-400 text-sm text-center animate-fade-in">
                  Please adjust the slider to respond
                </p>
              )}
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
                onClick={handleContinue}
                className="flex-1 bg-[#00ffd5] text-black hover:bg-[#00b4d8] transition-colors"
              >
                {isLastQuestion ? "Complete Assessment" : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};