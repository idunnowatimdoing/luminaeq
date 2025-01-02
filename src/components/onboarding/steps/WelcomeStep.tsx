import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { AuthOrb } from "@/components/auth/AuthOrb";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#051527] relative overflow-hidden">
      <AuthOrb className="opacity-40" />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Welcome to LuminaEQ! ✨
          </h1>
          <p className="text-gray-400 max-w-sm mx-auto">
            The World's First Digital EQ Journaling Experience! We're excited to join
            you on your journey to mastering emotional intelligence.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0a1f35] p-6 rounded-lg border border-[#1e3951] shadow-xl">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">
                What should we call you?
              </label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0a1f35] border-[#1e3951] text-gray-200 placeholder:text-gray-500"
                required
              />
            </div>
          </div>

          <div className="bg-[#0a1f35] p-6 rounded-lg border border-[#1e3951] shadow-xl">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">
                What's your age range?
              </label>
              <RadioGroup
                value={ageRange}
                onValueChange={setAgeRange}
                className="grid gap-3"
              >
                {ageRanges.map((range) => (
                  <div
                    key={range}
                    className="flex items-center space-x-3 bg-[#051527] p-3 rounded-md border border-[#1e3951] hover:border-[#00ffd5] transition-colors"
                  >
                    <RadioGroupItem
                      value={range}
                      id={range}
                      className="border-[#1e3951] text-[#00ffd5]"
                    />
                    <label
                      htmlFor={range}
                      className="text-sm text-gray-300 cursor-pointer"
                    >
                      {range}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-[#00ffd5] text-black hover:bg-[#00b4d8] transition-colors mt-6"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};