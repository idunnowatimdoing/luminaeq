interface TotalEQScoreProps {
  score: number;
}

export const TotalEQScore = ({ score }: TotalEQScoreProps) => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <h2 className="text-2xl font-bold text-white">Total EQ Score</h2>
    <div className="main-orb flex items-center justify-center">
      <span className="text-2xl font-bold text-white">
        {score}/500
      </span>
    </div>
  </div>
);