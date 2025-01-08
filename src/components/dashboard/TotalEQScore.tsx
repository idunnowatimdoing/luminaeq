interface TotalEQScoreProps {
  score: number;
  self_awareness: number;
  self_regulation: number;
  motivation: number;
  empathy: number;
  social_skills: number;
}

type PillarScores = {
  [key: string]: number;
  self_awareness: number;
  self_regulation: number;
  motivation: number;
  empathy: number;
  social_skills: number;
};

const formatPillarName = (pillar: string): string => {
  return pillar
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const findExtremeScores = (scores: PillarScores) => {
  let highestPillar = Object.entries(scores)[0];
  let lowestPillar = Object.entries(scores)[0];

  Object.entries(scores).forEach(([pillar, score]) => {
    if (score > highestPillar[1]) {
      highestPillar = [pillar, score];
    }
    if (score < lowestPillar[1]) {
      lowestPillar = [pillar, score];
    }
  });

  return {
    highest: {
      name: formatPillarName(highestPillar[0]),
      score: highestPillar[1]
    },
    lowest: {
      name: formatPillarName(lowestPillar[0]),
      score: lowestPillar[1]
    }
  };
};

export const TotalEQScore = ({ 
  score,
  self_awareness,
  self_regulation,
  motivation,
  empathy,
  social_skills 
}: TotalEQScoreProps) => {
  const scores: PillarScores = {
    self_awareness,
    self_regulation,
    motivation,
    empathy,
    social_skills
  };

  const { highest, lowest } = findExtremeScores(scores);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold text-white">Total EQ Score</h2>
      <div className="main-orb flex items-center justify-center">
        <span className="text-2xl font-bold text-white">
          {score}/500
        </span>
      </div>
      <div className="space-y-2 text-center">
        <div className="text-[#00ffd5]">
          <p className="text-sm uppercase tracking-wider">Top Pillar</p>
          <p className="font-semibold">{highest.name} ({highest.score}/100)</p>
        </div>
        <div className="text-blue-400">
          <p className="text-sm uppercase tracking-wider">Focus Area</p>
          <p className="font-semibold">{lowest.name} ({lowest.score}/100)</p>
        </div>
      </div>
    </div>
  );
};