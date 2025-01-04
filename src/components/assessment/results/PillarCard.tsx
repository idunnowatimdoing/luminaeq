import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { JournalEntryModal } from "./JournalEntryModal";
import { useState } from "react";

interface PillarCardProps {
  pillar: string;
  score: number;
  description: string;
  strengths: string;
  improvements: string;
  onClick: () => void;
  isLowestScore?: boolean;
}

const getPillarLevel = (score: number): string => {
  if (score >= 90) return "Advanced";
  if (score >= 75) return "Proficient";
  if (score >= 60) return "Intermediate";
  return "Beginner";
};

export const PillarCard = ({
  pillar,
  score,
  description,
  strengths,
  improvements,
  onClick,
  isLowestScore = false,
}: PillarCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card 
        className={`relative p-6 bg-black/20 border-gray-800 hover:bg-black/30 transition-colors cursor-pointer ${
          isLowestScore ? 'shadow-[0_0_30px_rgba(255,0,0,0.3)]' : ''
        }`}
        onClick={onClick}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>

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

      <JournalEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pillar={pillar}
      />
    </>
  );
};