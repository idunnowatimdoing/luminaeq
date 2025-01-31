import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JournalHeaderProps {
  pillarName: string;
}

export const JournalHeader = ({ pillarName }: JournalHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/dashboard')}
        className="text-white hover:text-primary"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-2xl font-bold text-white">
        {pillarName} Journal
      </h1>
    </div>
  );
};