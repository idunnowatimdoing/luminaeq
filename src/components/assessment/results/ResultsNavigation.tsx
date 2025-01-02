import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export const ResultsNavigation = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    console.log("Navigating to dashboard...");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex justify-between items-center pt-8">
      <Button
        onClick={handleGoToDashboard}
        className="bg-[#00ffd5] text-black hover:bg-[#00b4d8] transition-colors"
      >
        Go to Dashboard
      </Button>
      <Button
        onClick={() => navigate("/assessment")}
        variant="outline"
        className="bg-white/10 text-white hover:bg-white/20 border-gray-600"
      >
        Retake Assessment
      </Button>
    </div>
  );
};