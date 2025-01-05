import React from 'react';

interface TotalEQScoreProps {
  score: number;
  name?: string | null;  // Updated to allow null values
}

export const TotalEQScore = ({ score, name }: TotalEQScoreProps) => {
  return (
    <>
      <div className="text-center text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {name || 'User'}</h1>
        <h2 className="text-base sm:text-lg mt-2">Your Total EQ Score</h2>
      </div>
      <div className="flex justify-center">
        <div className="main-orb">
          <span className="text-2xl sm:text-4xl font-bold text-white">
            {score || 0}/500
          </span>
        </div>
      </div>
    </>
  );
};