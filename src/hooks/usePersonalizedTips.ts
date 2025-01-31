import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Tip {
  id: string;
  title: string;
  description: string;
  pillar_tags: string[];
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'proficient';
  popularity_score: number;
}

interface StreakData {
  streak_length: number;
}

interface EmotionData {
  emotion: string;
  count: number;
}

const getSkillLevel = (score: number): string => {
  if (score <= 40) return 'beginner';
  if (score <= 70) return 'intermediate';
  if (score <= 90) return 'advanced';
  return 'proficient';
};

export const usePersonalizedTips = (pillar: string, score: number) => {
  return useQuery({
    queryKey: ['tips', pillar, score],
    queryFn: async () => {
      console.log(`Fetching enhanced tips for ${pillar} at skill level ${getSkillLevel(score)}`);
      
      // Get streak data
      const { data: streakData, error: streakError } = await supabase
        .rpc('get_pillar_streak', {
          user_uuid: (await supabase.auth.getUser()).data.user?.id,
          pillar_name: pillar
        });

      if (streakError) {
        console.error('Error fetching streak:', streakError);
      }

      // Get emotion trends
      const { data: emotionData, error: emotionError } = await supabase
        .rpc('get_frequent_emotions', {
          user_uuid: (await supabase.auth.getUser()).data.user?.id,
          days: 30
        });

      if (emotionError) {
        console.error('Error fetching emotions:', emotionError);
      }

      // Get base tips
      const { data: tips, error: tipsError } = await supabase
        .from('benefits_tips')
        .select('*')
        .contains('pillar_tags', [pillar])
        .eq('skill_level', getSkillLevel(score))
        .order('popularity_score', { ascending: false })
        .limit(3);

      if (tipsError) {
        console.error('Error fetching tips:', tipsError);
        throw tipsError;
      }

      // Enhance tips with streak and emotion data
      const enhancedTips = tips.map(tip => {
        let enhancedDescription = tip.description;

        // Add streak context if available
        if (streakData && streakData.streak_length > 0) {
          enhancedDescription = `🔥 ${streakData.streak_length} day streak! ${enhancedDescription}`;
        }

        // Add emotion context if available
        if (emotionData && emotionData.length > 0) {
          const topEmotion = emotionData[0];
          if (topEmotion.count > 3) {
            enhancedDescription += `\n\n💭 Noticing "${topEmotion.emotion}" often? This tip might help: Try breaking it down into smaller steps.`;
          }
        }

        return {
          ...tip,
          description: enhancedDescription
        };
      });

      return enhancedTips as Tip[];
    },
  });
};