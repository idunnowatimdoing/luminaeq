import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ageRanges = [
  "Under 18",
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55+"
];

export const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmitProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          age_range: ageRange,
          onboarding_completed: true
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setStep(3);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStartAssessment = () => {
    navigate("/assessment");
  };

  const handleSkipAssessment = () => {
    navigate("/");
  };

  if (step === 1) {
    return (
      <div className="w-full max-w-md space-y-6 p-6 rounded-lg bg-card">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to LuminaEQ! 🌟</h1>
          <p className="text-muted-foreground">
            The World's First Digital EQ Journaling Experience! We're excited to join you on your journey to mastering emotional intelligence.
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
          onClick={() => {
            if (!name || !ageRange) {
              toast({
                title: "Required fields",
                description: "Please fill in all fields to continue",
                variant: "destructive",
              });
              return;
            }
            handleSubmitProfile();
          }}
        >
          Continue
        </Button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="w-full max-w-md space-y-6 p-6 rounded-lg bg-card">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Let's Get Started with Your EQ Journey
          </h2>
          <p className="text-muted-foreground">
            Lumina works best when it understands you. Let's complete a quick Emotional Intelligence (EQ) assessment.
          </p>
          <p className="text-sm text-muted-foreground">
            This involves 15 questions and takes about 5 minutes.
          </p>
          <p className="text-xs text-muted-foreground">
            The assessment is recommended for a tailored experience, but it's not required.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full bg-[#00ffd5] text-black hover:bg-[#00b4d8]"
            onClick={handleStartAssessment}
          >
            Start Assessment
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSkipAssessment}
          >
            Skip for Now
          </Button>
        </div>
      </div>
    );
  }

  return null;
};