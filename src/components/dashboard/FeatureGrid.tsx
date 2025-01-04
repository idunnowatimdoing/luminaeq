import React from 'react';
import { Trophy, Award, BookOpen, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  comingSoon?: boolean;
}

const FeatureCard = ({ icon, title, comingSoon }: FeatureCardProps) => (
  <Card className="w-full bg-glass flex flex-col items-center space-y-4 p-4 sm:p-6">
    <div className="feature-orb">
      {icon}
    </div>
    <h3 className="text-base sm:text-lg text-white">{title}</h3>
    {comingSoon && <p className="text-sm sm:text-base text-gray-300">Coming Soon</p>}
  </Card>
);

export const FeatureGrid = () => {
  const features = [
    { icon: <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Challenges" },
    { icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Badges" },
    { icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Learning" },
    { icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />, title: "LuminaConnect", comingSoon: true }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          comingSoon={feature.comingSoon}
        />
      ))}
    </div>
  );
};