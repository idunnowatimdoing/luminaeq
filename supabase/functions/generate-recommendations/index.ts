import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId } = await req.json();
    console.log('Generating recommendations for user:', userId);

    // Fetch user's recent data
    const { data: journalEntries } = await supabase
      .from('journal_entries')
      .select('sentiment_data, pillar')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Generate recommendation based on user data
    let recommendation = "Keep working on your emotional intelligence journey!";
    
    if (profile && journalEntries) {
      // Find the pillar that needs most improvement
      const pillars = ['self_awareness', 'self_regulation', 'motivation', 'empathy', 'social_skills'];
      const lowestPillar = pillars.reduce((min, pillar) => 
        profile[pillar] < profile[min] ? pillar : min
      );

      // Create personalized recommendation
      recommendation = `Focus on improving your ${lowestPillar.replace('_', ' ')}. ` +
        'Try practicing mindfulness and self-reflection exercises daily.';
    }

    // Store the recommendation
    const { error: insertError } = await supabase
      .from('messages')
      .insert({
        user_id: userId,
        title: 'AI Recommendation',
        content: recommendation,
      });

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});