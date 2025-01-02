import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const ageRanges = ["Under 18", "18-24", "25-34", "35-44", "45-54", "55+"];

interface WelcomeStepProps {
  name: string;
  setName: (name: string) => void;
  ageRange: string;
  setAgeRange: (range: string) => void;
  onNext: () => void;
}

export const WelcomeStep = ({
  name,
  setName,
  ageRange,
  setAgeRange,
  onNext,
}: WelcomeStepProps) => {
  const { toast } = useToast();

  const handleContinue = () => {
    if (!name || !ageRange) {
      toast({
        title: "Required fields",
        description: "Please fill in all fields to continue",
        variant: "destructive",
      });
      return;
    }
    onNext();
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 rounded-lg bg-card">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome to LuminaEQ! 🌟
        </h1>
        <p className="text-muted-foreground">
          The World's First Digital EQ Journaling Experience! We're excited to join
          you on your journey to mastering emotional intelligence.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            What should we call you?
          </label>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            What's your age range?
          </label>
          <RadioGroup
            value={ageRange}
            onValueChange={setAgeRange}
            className="grid gap-2"
          >
            {ageRanges.map((range) => (
              <div key={range} className="flex items-center space-x-2">
                <RadioGroupItem value={range} id={range} />
                <label htmlFor={range}>{range}</label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <Button
        className="w-full bg-[#00ffd5] text-black hover:bg-[#00b4d8]"
        onClick={handleContinue}
      >
        Continue
      </Button>
    </div>
  );
};