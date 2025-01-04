import React from 'react';
import { PillarCard } from './PillarCard';
import Orb from '../orb';
import { DashboardData } from '@/hooks/dashboard/useDashboardData';

interface PillarGridProps {
  dashboardData: DashboardData | null;
}

export const PillarGrid = ({ dashboardData }: PillarGridProps) => {
  const pillars = [
    {
      title: "Self Awareness",
      value: dashboardData?.self_awareness,
      color: "#FF6F61",
      gradientClass: "gradient-selfawareness"
    },
    {
      title: "Self Regulation",
      value: dashboardData?.self_regulation,
      color: "#6BCB77",
      gradientClass: "gradient-selfregulation"
    },
    {
      title: "Motivation",
      value: dashboardData?.motivation,
      color: "#4F86F7",
      gradientClass: "gradient-motivation"
    },
    {
      title: "Empathy",
      value: dashboardData?.empathy,
      color: "#FFD700",
      gradientClass: "gradient-empathy"
    },
    {
      title: "Social Skills",
      value: dashboardData?.social_skills,
      color: "#A020F0",
      gradientClass: "gradient-socialskills"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-8">
      {pillars.map((pillar) => (
        <PillarCard
          key={pillar.title}
          title={pillar.title}
          currentValue={pillar.value || 0}
          goalValue={100}
          gradientClass={pillar.gradientClass}
        >
          <Orb size="80px" color={pillar.color} glow={true} />
        </PillarCard>
      ))}
    </div>
  );
};