import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileScores {
  totalScore: number;
  selfAwareness: number;
  selfRegulation: number;
  motivation: number;
  empathy: number;
  socialSkills: number;
}

export const useProfileUpdate = () => {
  const updateProfile = async (userId: string, scores: ProfileScores) => {
    console.log("Updating profile with scores:", scores);
    
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        total_eq_score: scores.totalScore,
        self_awareness: Math.round(scores.selfAwareness),
        self_regulation: Math.round(scores.selfRegulation),
        motivation: Math.round(scores.motivation),
        empathy: Math.round(scores.empathy),
        social_skills: Math.round(scores.socialSkills),
        onboarding_completed: true,
      })
      .eq("user_id", userId);

    if (profileError) {
      console.error("Profile update error:", profileError);
      throw profileError;
    }

    console.log("Profile updated successfully with assessment scores");
  };

  return { updateProfile };
};