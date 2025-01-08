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
      console.log(`Fetching tips for ${pillar} at skill level ${getSkillLevel(score)}`);
      
      const { data, error } = await supabase
        .from('benefits_tips')
        .select('*')
        .contains('pillar_tags', [pillar])
        .eq('skill_level', getSkillLevel(score))
        .order('popularity_score', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching tips:', error);
        throw error;
      }

      return data as Tip[];
    },
  });
};