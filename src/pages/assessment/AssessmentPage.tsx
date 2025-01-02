import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AssessmentQuestion } from "@/components/assessment/AssessmentQuestion";
import { toast } from "sonner";
import { useAssessmentState } from "./hooks/useAssessmentState";
import { calculateScores } from "./utils/calculateScores";

export const AssessmentPage = () => {
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

  useEffect(() => {
    const initializeAssessment = async () => {
      try {
        console.log("Initializing assessment...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, redirecting to auth");
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error initializing assessment:", error);
        toast.error("Failed to initialize assessment. Please try again.");
      }
    };

    initializeAssessment();
  }, [navigate]);

  const handleResponse = async (value: number) => {
    if (isSubmitting) return; // Prevent multiple submissions

    console.log("Recording response:", { questionIndex: currentQuestionIndex, value });
    
    // Ensure the value is between 0 and 100 and is an integer
    const normalizedValue = Math.min(Math.max(Math.round(value), 0), 100);
    
    setResponses((prev) => ({
      ...prev,
      [shuffledQuestions[currentQuestionIndex].id]: normalizedValue,
    }));

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      handleNextQuestion();
    } else {
      await calculateAndSaveScores();
    }
  };

  const calculateAndSaveScores = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("No authenticated user found");
      }

      const { pillarScores, totalScore } = calculateScores(responses, shuffledQuestions);

      // Create normalized responses array with validated scores
      const normalizedResponses = Object.entries(responses).map(([questionId, score]) => ({
        user_id: session.user.id,
        question_id: parseInt(questionId),
        score: Math.min(Math.max(Math.round(score), 0), 100),
        pillar: shuffledQuestions.find(q => q.id === parseInt(questionId))?.pillar || '',
      }));

      // Use upsert instead of insert to handle duplicates
      const { error: responsesError } = await supabase
        .from("assessment_responses")
        .upsert(normalizedResponses, {
          onConflict: 'user_id,question_id',
          ignoreDuplicates: false
        });

      if (responsesError) {
        console.error("Error saving responses:", responsesError);
        throw responsesError;
      }

      // Update user profile with scores
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          total_eq_score: totalScore,
          self_awareness: Math.round(pillarScores.selfAwareness),
          self_regulation: Math.round(pillarScores.selfRegulation),
          motivation: Math.round(pillarScores.motivation),
          empathy: Math.round(pillarScores.empathy),
          social_skills: Math.round(pillarScores.socialSkills),
          onboarding_completed: true,
        })
        .eq("user_id", session.user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }

      // Navigate back to onboarding with scores
      navigate("/", {
        state: {
          assessmentScores: {
            total: totalScore,
            ...pillarScores,
          },
        },
      });
    } catch (error: any) {
      console.error("Error saving assessment results:", error);
      toast.error("Failed to save assessment results. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#051527] flex items-center justify-center">
        <div className="text-white text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-[#00ffd5] border-t-transparent rounded-full mx-auto"></div>
          <p>Loading your assessment...</p>
        </div>
      </div>
    );
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