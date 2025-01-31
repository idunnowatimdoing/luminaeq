import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    console.log('Analyzing trends for user:', userId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch last 30 days of journal entries
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: entries, error: entriesError } = await supabase
      .from('journal_entries')
      .select('mood, pillar, sentiment_data, created_at')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (entriesError) throw entriesError;

    // Analyze mood trends
    const moodFrequency: Record<string, number> = {};
    const pillarFrequency: Record<string, number> = {};
    const moodByDay: Record<string, string[]> = {};

    entries?.forEach(entry => {
      // Track mood frequency
      if (entry.mood) {
        moodFrequency[entry.mood] = (moodFrequency[entry.mood] || 0) + 1;
      }

      // Track pillar frequency
      if (entry.pillar) {
        pillarFrequency[entry.pillar] = (pillarFrequency[entry.pillar] || 0) + 1;
      }

      // Track moods by day
      const day = new Date(entry.created_at).toISOString().split('T')[0];
      if (!moodByDay[day]) {
        moodByDay[day] = [];
      }
      if (entry.mood) {
        moodByDay[day].push(entry.mood);
      }
    });

    // Generate insights
    const insights = [];
    const totalEntries = entries?.length || 0;

    // Analyze dominant mood
    const dominantMood = Object.entries(moodFrequency)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    if (dominantMood) {
      insights.push(`Your predominant mood has been ${dominantMood}`);
    }

    // Analyze mood patterns
    const moodPattern = analyzeMoodPatterns(moodByDay);
    if (moodPattern) {
      insights.push(moodPattern);
    }

    // Analyze pillar focus
    const mostFrequentPillar = Object.entries(pillarFrequency)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    if (mostFrequentPillar) {
      insights.push(`You've been focusing most on ${formatPillar(mostFrequentPillar)}`);
    }

    // Generate recommendations
    const recommendations = generateRecommendations({
      dominantMood,
      mostFrequentPillar,
      totalEntries,
      moodFrequency
    });

    // Store insights in the messages table
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        user_id: userId,
        title: 'Journal Analysis Insights',
        content: recommendations.join('\n\n'),
      });

    if (messageError) throw messageError;

    return new Response(
      JSON.stringify({
        insights,
        recommendations,
        moodFrequency,
        pillarFrequency,
        entriesAnalyzed: totalEntries
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error analyzing trends:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function analyzeMoodPatterns(moodByDay: Record<string, string[]>): string | null {
  const days = Object.keys(moodByDay).length;
  if (days < 3) return null;

  const moodCounts = Object.values(moodByDay).flat().reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalMoods = Object.values(moodCounts).reduce((a, b) => a + b, 0);
  const positiveRatio = ((moodCounts['happy'] || 0) / totalMoods) * 100;

  if (positiveRatio > 70) {
    return "You've been maintaining a consistently positive mood";
  } else if (positiveRatio < 30) {
    return "You might benefit from focusing on activities that boost your mood";
  }
  return "Your mood has been balanced with both ups and downs";
}

function generateRecommendations(data: {
  dominantMood: string;
  mostFrequentPillar: string;
  totalEntries: number;
  moodFrequency: Record<string, number>;
}): string[] {
  const recommendations: string[] = [];

  // Journaling frequency recommendation
  if (data.totalEntries < 10) {
    recommendations.push(
      "Consider journaling more frequently to better track your emotional patterns. " +
      "Aim for at least one entry every few days."
    );
  }

  // Mood-based recommendations
  if (data.dominantMood === 'sad' || data.dominantMood === 'angry') {
    recommendations.push(
      "Try incorporating more positive activities into your daily routine. " +
      "Consider meditation, exercise, or spending time with loved ones."
    );
  }

  // Pillar-based recommendations
  if (data.mostFrequentPillar) {
    const otherPillars = [
      'self_awareness',
      'self_regulation',
      'motivation',
      'empathy',
      'social_skills'
    ].filter(p => p !== data.mostFrequentPillar);

    recommendations.push(
      `While you're doing well with ${formatPillar(data.mostFrequentPillar)}, ` +
      `consider exploring ${formatPillar(otherPillars[0])} or ${formatPillar(otherPillars[1])} ` +
      `to maintain a balanced emotional growth.`
    );
  }

  // Emotional variety recommendation
  const uniqueMoods = Object.keys(data.moodFrequency).length;
  if (uniqueMoods <= 2) {
    recommendations.push(
      "Try to be more specific about your emotions when journaling. " +
      "This can help you better understand your emotional patterns."
    );
  }

  return recommendations;
}

function formatPillar(pillar: string): string {
  return pillar
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}