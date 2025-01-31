import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const JournalPage = () => {
  const { pillar } = useParams();
  const navigate = useNavigate();

  const formatPillarName = (pillar: string) => {
    return pillar
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-[#051527] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
            {formatPillarName(pillar || '')} Journal
          </h1>
        </div>

        {/* Journal Content - Placeholder for now */}
        <div className="bg-black/20 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-gray-800">
          <p className="text-white">Journal content coming soon...</p>
        </div>
      </div>
    </div>
  );
};