import { useState, useEffect } from "react";
import { Question } from "../types";
import { questions } from "../constants";

export const useAssessmentState = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: number }>({});
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    console.log("Questions shuffled, count:", shuffled.length);
    setShuffledQuestions(shuffled);
    setIsLoading(false);
  }, []);

  const handleNextQuestion = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  return {
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
  };
};