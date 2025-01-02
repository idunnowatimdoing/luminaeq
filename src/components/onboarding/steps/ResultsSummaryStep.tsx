import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ResultsSummaryStepProps {
  name: string;
  assessmentScores: {
    total: number;
    selfAwareness: number;
    selfRegulation: number;
    motivation: number;
    empathy: number;
    socialSkills: number;
  };
  onContinue: () => void;
}

export const ResultsSummaryStep = ({
  assessmentScores,
  onContinue,
}: ResultsSummaryStepProps) => {
  const navigate = useNavigate();

  // Navigate to results page with scores as state
  useEffect(() => {
    navigate("/assessment/results", {
      replace: true,
      state: {
        totalScore: assessmentScores.total,
        pillarScores: {
          selfAwareness: assessmentScores.selfAwareness,
          selfRegulation: assessmentScores.selfRegulation,
          motivation: assessmentScores.motivation,
          empathy: assessmentScores.empathy,
          socialSkills: assessmentScores.socialSkills
        }
      }
    });
  }, [navigate, assessmentScores]);

  return null; // Component will redirect immediately
};