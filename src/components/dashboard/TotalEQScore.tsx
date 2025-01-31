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

const getPillarLevel = (score: number): string => {
  if (score >= 90) return "Advanced";
  if (score >= 75) return "Proficient";
  if (score >= 60) return "Intermediate";
  return "Beginner";
};

const getTotalLevel = (score: number): string => {
  if (score >= 450) return "Advanced";
  if (score >= 375) return "Proficient";
  if (score >= 300) return "Intermediate";
  return "Beginner";
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
      level: getPillarLevel(highestPillar[1])
    },
    lowest: {
      name: formatPillarName(lowestPillar[0]),
      level: getPillarLevel(lowestPillar[1])
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
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-white">Overall Level</h2>
        <p className="text-3xl font-bold text-[#00ffd5]">{getTotalLevel(score)}</p>
      </div>
      <div className="main-orb flex items-center justify-center" />
      <div className="space-y-2 text-center">
        <div className="text-[#00ffd5]">
          <p className="text-sm uppercase tracking-wider">Top Pillar</p>
          <p className="font-semibold">{highest.name} ({highest.level})</p>
        </div>
        <div className="text-blue-400">
          <p className="text-sm uppercase tracking-wider">Focus Area</p>
          <p className="font-semibold">{lowest.name} ({lowest.level})</p>
        </div>
      </div>
    </div>
  );
};