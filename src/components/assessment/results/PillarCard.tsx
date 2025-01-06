import { Card } from "@/components/ui/card";

interface PillarCardProps {
  pillar: string;
  score: number;
  description: string;
  strengths: string;
  improvements: string;
  onClick: () => void;
}

const getPillarLevel = (score: number): string => {
  if (score >= 90) return "Advanced";     // Was 18
  if (score >= 75) return "Proficient";   // Was 15
  if (score >= 60) return "Intermediate"; // Was 12
  return "Beginner";
};

export const PillarCard = ({
  pillar,
  score,
  description,
  strengths,
  improvements,
  onClick,
}: PillarCardProps) => {
  return (
    <Card 
      className="p-6 bg-black/20 border-gray-800 hover:bg-black/30 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold text-white mb-2">{pillar}</h3>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-2xl font-bold text-[#00ffd5]">{score}</span>
        <span className="text-gray-400">/ 100</span>
        <span className="text-sm text-gray-400 ml-2">
          ({getPillarLevel(score)})
        </span>
      </div>
      <p className="text-gray-300 text-sm mb-4">{description}</p>
      <div className="space-y-2">
        <p className="text-sm text-green-400">
          <span className="font-semibold">Strength:</span> {strengths}
        </p>
        <p className="text-sm text-blue-400">
          <span className="font-semibold">Focus Area:</span> {improvements}
        </p>
      </div>
    </Card>
  );
};