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
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAssessment = async () => {
      try {
        console.log("Initializing assessment...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, redirecting to auth");
          navigate("/auth");
          return;
        }

        // Shuffle questions
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        console.log("Questions shuffled, count:", shuffled.length);
        setShuffledQuestions(shuffled);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing assessment:", error);
        toast.error("Failed to initialize assessment. Please try again.");
        setIsLoading(false);
      }
    };

    initializeAssessment();
  }, [navigate]);

  const handleResponse = (value: number) => {
    console.log("Recording response:", { questionIndex: currentQuestionIndex, value });
    
    setResponses((prev) => ({
      ...prev,
      [shuffledQuestions[currentQuestionIndex].id]: value,
    }));

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      handleNextQuestion();
    } else {
      calculateAndSaveScores();
    }
  };

  const handleNextQuestion = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const calculateAndSaveScores = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("No authenticated user found");
      }

      // Calculate pillar scores
      const pillarScores = {
        selfAwareness: 0,
        selfRegulation: 0,
        motivation: 0,
        empathy: 0,
        socialSkills: 0,
      };

      questions.forEach((question) => {
        const response = responses[question.id];
        pillarScores[question.pillar as keyof typeof pillarScores] += (response / 100) * 6.67;
      });

      const totalScore = Math.round(
        Object.values(pillarScores).reduce((sum, score) => sum + score, 0)
      );

      console.log("Calculated scores:", { pillarScores, totalScore });

      // Save assessment responses
      const { error: responsesError } = await supabase
        .from("assessment_responses")
        .insert(
          Object.entries(responses).map(([questionId, score]) => ({
            user_id: session.user.id,
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
          onboarding_completed: true,
        })
        .eq("user_id", session.user.id);

      if (profileError) throw profileError;

      // Navigate back to onboarding with scores
      navigate("/", {
        state: {
          assessmentScores: {
            total: totalScore,
            ...pillarScores,
          },
        },
      });
    } catch (error: any) {
      console.error("Error saving assessment results:", error);
      toast.error("Failed to save assessment results. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#051527] flex items-center justify-center">
        <div className="text-white text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-[#00ffd5] border-t-transparent rounded-full mx-auto"></div>
          <p>Loading your assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      <AssessmentQuestion
        question={shuffledQuestions[currentQuestionIndex].text}
        onResponse={handleResponse}
        value={responses[shuffledQuestions[currentQuestionIndex].id] || 50}
        onPrevious={handlePreviousQuestion}
        showPrevious={currentQuestionIndex > 0}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={shuffledQuestions.length}
      />
    </div>
  );
};
