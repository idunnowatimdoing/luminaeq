import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AuthOrb } from "@/components/auth/AuthOrb";

interface AssessmentIntroStepProps {
  onSkip: () => void;
  onStartAssessment: () => void;
}

export const AssessmentIntroStep = ({
  onSkip,
  onStartAssessment,
}: AssessmentIntroStepProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#051527] relative overflow-hidden">
      {/* Positioned orb to the right side */}
      <AuthOrb className="left-2/3 top-1/4 opacity-60" />
      
      <Card className="w-full max-w-md mx-auto bg-card/20 backdrop-blur-lg border-white/20 relative z-10">
        <CardHeader className="space-y-2 text-center pb-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00ffd5] to-[#0077b6] text-transparent bg-clip-text">
            Let's Get Started with Your EQ Journey
          </h2>
        </CardHeader>
        
        <CardContent className="space-y-4 text-center px-6">
          <p className="text-lg text-gray-200">
            Lumina works best when it understands you. Let's complete a quick
            Emotional Intelligence (EQ) assessment.
          </p>
          <p className="text-sm text-gray-300">
            This involves 15 questions and takes about 5 minutes.
          </p>
          <p className="text-xs text-white/80">
            The assessment is recommended for a tailored experience, but it's not
            required.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 px-6 pb-6">
          <Button
            className="w-full bg-[#00ffd5] text-black hover:bg-[#00b4d8] transition-colors"
            onClick={onStartAssessment}
          >
            Start Assessment
          </Button>
          <Button 
            variant="outline" 
            className="w-full bg-white/5 border-white/20 hover:bg-white/10 text-white"
            onClick={onSkip}
          >
            Skip for Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};