import { WelcomeStep } from "./steps/WelcomeStep";
import { AssessmentIntroStep } from "./steps/AssessmentIntroStep";
import { ResultsSummaryStep } from "./steps/ResultsSummaryStep";
import { useOnboarding } from "@/hooks/useOnboarding";

export const OnboardingFlow = () => {
  const {
    step,
    name,
    setName,
    ageRange,
    setAgeRange,
    assessmentScores,
    handleSubmitProfile,
    handleSkipAssessment,
    handleStartAssessment,
    handleCompleteAssessment,
    setStep,
  } = useOnboarding();

  if (step === 1) {
    return (
      <WelcomeStep
        name={name}
        setName={setName}
        ageRange={ageRange}
        setAgeRange={setAgeRange}
        onNext={() => setStep(2)}
      />
    );
  }

  if (step === 2) {
    return (
      <AssessmentIntroStep
        onSkip={handleSkipAssessment}
        onStartAssessment={handleStartAssessment}
      />
    );
  }

  if (step === 3 && assessmentScores) {
    return (
      <ResultsSummaryStep
        name={name}
        assessmentScores={assessmentScores}
        onContinue={handleSubmitProfile}
      />
    );
  }

  return null;
};