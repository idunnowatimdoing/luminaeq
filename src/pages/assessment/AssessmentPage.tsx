import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AssessmentQuestion } from "@/components/assessment/AssessmentQuestion";
import { toast } from "sonner";

interface Question {
  id: number;
  text: string;
  pillar: string;
}

const questions: Question[] = [
  // Self-Awareness
  { id: 1, text: "How well do you recognize your own emotions as they occur?", pillar: "selfAwareness" },
  { id: 2, text: "Can you accurately identify the triggers that cause specific emotional responses in you?", pillar: "selfAwareness" },
  { id: 3, text: "To what extent can you predict how certain situations will affect your mood?", pillar: "selfAwareness" },
  // Self-Regulation
  { id: 4, text: "How effectively can you manage your emotions in stressful situations?", pillar: "selfRegulation" },
  { id: 5, text: "How often do you pause to think before reacting to a challenging scenario?", pillar: "selfRegulation" },
  { id: 6, text: "To what degree can you adapt your behavior when you realize it's not appropriate for the situation?", pillar: "selfRegulation" },
  // Motivation
  { id: 7, text: "How persistent are you in pursuing your goals, even when faced with setbacks?", pillar: "motivation" },
  { id: 8, text: "To what extent do you seek out new challenges and opportunities for growth?", pillar: "motivation" },
  { id: 9, text: "How often do you take initiative without being prompted by others?", pillar: "motivation" },
  // Empathy
  { id: 10, text: "How well can you recognize and understand the emotions of others?", pillar: "empathy" },
  { id: 11, text: "To what degree can you put yourself in someone else's position and see things from their perspective?", pillar: "empathy" },
  { id: 12, text: "How accurately can you interpret non-verbal cues and body language in social interactions?", pillar: "empathy" },
  // Social Skills
  { id: 13, text: "How effectively can you build and maintain positive relationships with diverse groups of people?", pillar: "socialSkills" },
  { id: 14, text: "To what extent can you resolve conflicts and negotiate solutions that satisfy all parties involved?", pillar: "socialSkills" },
  { id: 15, text: "How skilled are you at inspiring and leading others towards a common goal?", pillar: "socialSkills" },
];

export const AssessmentPage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: number }>({});
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Shuffle questions on component mount
    setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
  }, []);

  const handleResponse = (value: number) => {
    setResponses((prev) => ({
      ...prev,
      [shuffledQuestions[currentQuestionIndex].id]: value,
    }));

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateAndSaveScores();
    }
  };

  const calculateAndSaveScores = async () => {
    // Calculate pillar scores (max 20 points per pillar)
    const pillarScores = {
      selfAwareness: 0,
      selfRegulation: 0,
      motivation: 0,
      empathy: 0,
      socialSkills: 0,
    };

    // Calculate scores for each pillar
    questions.forEach((question) => {
      const response = responses[question.id];
      // Each question can contribute up to 6.67 points (20 points / 3 questions)
      pillarScores[question.pillar as keyof typeof pillarScores] += (response / 100) * 6.67;
    });

    // Calculate total EQ score (sum of all pillar scores, max 100)
    const totalScore = Math.round(
      Object.values(pillarScores).reduce((sum, score) => sum + score, 0)
    );

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      // Save assessment responses
      const { error: responsesError } = await supabase
        .from("assessment_responses")
        .insert(
          Object.entries(responses).map(([questionId, score]) => ({
            user_id: user.id,
            question_id: parseInt(questionId),
            score,
            pillar: questions.find(q => q.id === parseInt(questionId))?.pillar,
          }))
        );

      if (responsesError) throw responsesError;

      // Update user profile with scores
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          total_eq_score: totalScore,
          self_awareness: Math.round(pillarScores.selfAwareness),
          self_regulation: Math.round(pillarScores.selfRegulation),
          motivation: Math.round(pillarScores.motivation),
          empathy: Math.round(pillarScores.empathy),
          social_skills: Math.round(pillarScores.socialSkills),
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // Navigate back to onboarding with scores
      navigate("/", {
        state: {
          assessmentScores: {
            total: totalScore,
            selfAwareness: Math.round(pillarScores.selfAwareness),
            selfRegulation: Math.round(pillarScores.selfRegulation),
            motivation: Math.round(pillarScores.motivation),
            empathy: Math.round(pillarScores.empathy),
            socialSkills: Math.round(pillarScores.socialSkills),
          },
        },
      });
    } catch (error: any) {
      console.error("Error saving assessment results:", error);
      toast.error("Failed to save assessment results. Please try again.");
    }
  };

  if (shuffledQuestions.length === 0) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
          </h1>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <AssessmentQuestion
          question={shuffledQuestions[currentQuestionIndex].text}
          onResponse={handleResponse}
          value={responses[shuffledQuestions[currentQuestionIndex].id] || 50}
        />
      </div>
    </div>
  );
};