import { PillarScore } from "./PillarScore";

interface PillarScoresProps {
  scores: {
    self_awareness: number;
    self_regulation: number;
    motivation: number;
    empathy: number;
    social_skills: number;
  };
}

export const PillarScores = ({ scores }: PillarScoresProps) => (
  <>
    <h2 className="text-2xl font-bold text-white text-center">EQ Pillar Scores</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <PillarScore
        title="Self Awareness"
        currentScore={scores.self_awareness}
        goalScore={100}
        gradientClass="gradient-selfawareness"
      />
      <PillarScore
        title="Self Regulation"
        currentScore={scores.self_regulation}
        goalScore={90}
        gradientClass="gradient-selfregulation"
      />
      <PillarScore
        title="Motivation"
        currentScore={scores.motivation}
        goalScore={100}
        gradientClass="gradient-motivation"
      />
      <PillarScore
        title="Empathy"
        currentScore={scores.empathy}
        goalScore={100}
        gradientClass="gradient-empathy"
      />
      <PillarScore
        title="Social Skills"
        currentScore={scores.social_skills}
        goalScore={95}
        gradientClass="gradient-socialskills"
      />
    </div>
  </>
);