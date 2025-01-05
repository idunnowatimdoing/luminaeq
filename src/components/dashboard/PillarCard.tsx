import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ReactNode, useState } from "react";
import { JournalEntryModal } from "@/components/assessment/results/JournalEntryModal";

interface PillarCardProps {
  title: string;
  currentValue: number;
  goalValue: number;
  gradientClass: string;
  children?: ReactNode;
}

export const PillarCard = ({ title, currentValue, goalValue, gradientClass, children }: PillarCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`pillar-orb ${gradientClass} relative`}>
        {children}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0 rounded-full hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          aria-label={`Open journal entry for ${title}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Card className="w-full bg-glass">
        <CardHeader className="text-center py-2">
          <CardTitle className="text-sm sm:text-lg text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="flex justify-between text-xs sm:text-sm text-gray-300">
            <span>Current: {currentValue}/100</span>
            <span>Goal: {goalValue}/100</span>
          </div>
        </CardContent>
      </Card>

      <JournalEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pillar={title}
      />
    </div>
  );
};