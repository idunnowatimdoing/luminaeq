import React from 'react';

interface ResultsHeaderProps {
  totalScore: number;
}

const getTotalLevel = (score: number): string => {
  if (score >= 90) return "Advanced";
  if (score >= 75) return "Proficient";
  if (score >= 60) return "Intermediate";
  return "Beginner";
};

export const ResultsHeader = ({ totalScore }: ResultsHeaderProps) => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-bold text-white">Your EQ Assessment Results</h1>
      <p className="text-lg text-gray-300">
        Congratulations! Here's a breakdown of your emotional intelligence across five key pillars.
      </p>
      <div className="flex flex-col items-center space-y-2">
        <span className="text-5xl font-bold text-[#00ffd5]">{totalScore}</span>
        <span className="text-xl text-gray-300">Overall EQ Score - {getTotalLevel(totalScore)}</span>
      </div>
    </div>
  );
};