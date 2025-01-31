import { PillarScore } from "./PillarScore";

interface PillarScoresProps {
  scores: {
    self_awareness: number;
    self_regulation: number;
    motivation: number;
    empathy: number;
    social_skills: number;
    safe_space_entries?: number;
    safe_space_limit?: number;
  };
}

export const PillarScores = ({ scores }: PillarScoresProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white text-center mb-8">EQ Pillar Levels</h2>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      <PillarScore
        title="Self Awareness"
        currentScore={scores.self_awareness}
        gradientClass="gradient-selfawareness"
      />
      <PillarScore
        title="Self Regulation"
        currentScore={scores.self_regulation}
        gradientClass="gradient-selfregulation"
      />
      <PillarScore
        title="Motivation"
        currentScore={scores.motivation}
        gradientClass="gradient-motivation"
      />
      <PillarScore
        title="Empathy"
        currentScore={scores.empathy}
        gradientClass="gradient-empathy"
      />
      <PillarScore
        title="Social Skills"
        currentScore={scores.social_skills}
        gradientClass="gradient-socialskills"
      />
      <PillarScore
        title="Safe Space"
        isSafeSpace={true}
        safeSpaceEntries={scores.safe_space_entries || 0}
        safeSpaceLimit={scores.safe_space_limit}
        gradientClass="gradient-safespace"
      />
    </div>
  </div>
);