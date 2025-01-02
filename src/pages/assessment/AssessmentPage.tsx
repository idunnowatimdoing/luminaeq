import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AssessmentQuestion } from "@/components/assessment/AssessmentQuestion";
import { AssessmentLoading } from "@/components/assessment/AssessmentLoading";
import { AssessmentInit } from "@/components/assessment/AssessmentInit";
import { useAssessmentState } from "./hooks/useAssessmentState";
import { useAssessmentSubmission } from "@/components/assessment/AssessmentSubmission";

export const AssessmentPage = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  
  const {
    currentQuestionIndex,
    responses,
    setResponses,
    shuffledQuestions,
    isAnimating,
    isLoading,
    isSubmitting,
    setIsSubmitting,
    handleNextQuestion,
    handlePreviousQuestion,
  } = useAssessmentState();

  const { handleSubmitAssessment } = useAssessmentSubmission({
    responses,
    shuffledQuestions,
    isSubmitting,
    setIsSubmitting,
  });

  const handleResponse = async (value: number) => {
    if (isSubmitting) {
      console.log("Submission in progress, ignoring response");
      return;
    }

    console.log("Recording response:", { questionIndex: currentQuestionIndex, value });
    
    const normalizedValue = Math.min(Math.max(Math.round(value), 0), 100);
    
    setResponses((prev) => ({
      ...prev,
      [shuffledQuestions[currentQuestionIndex].id]: normalizedValue,
    }));

    // If this is the last question, submit the assessment
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
      console.log("Last question completed, submitting assessment");
      await handleSubmitAssessment();
    } else {
      handleNextQuestion();
    }
  };

  if (!isInitialized) {
    return <AssessmentInit onInitialized={() => setIsInitialized(true)} />;
  }

  if (isLoading) {
    return <AssessmentLoading />;
  }

  return (
    <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      <AssessmentQuestion
        question={shuffledQuestions[currentQuestionIndex].text}
        onResponse={handleResponse}
        value={responses[shuffledQuestions[currentQuestionIndex].id] || 50}
        onPrevious={handlePreviousQuestion}
        showPrevious={currentQuestionIndex > 0}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={shuffledQuestions.length}
      />
    </div>
  );
};