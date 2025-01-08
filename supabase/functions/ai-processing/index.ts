import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, type, audio } = await req.json();
    console.log(`Processing ${type} request`);

    if (type === 'sentiment') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Analyze the sentiment of the following text. Return a JSON object with: sentiment (positive/negative/neutral), score (0-1), and dominant_emotion (joy/sadness/anger/fear/neutral).'
            },
            { role: 'user', content: text }
          ],
        }),
      });

      const data = await response.json();
      console.log('Sentiment analysis response:', data);

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from OpenAI');
      }

      return new Response(data.choices[0].message.content, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'transcribe') {
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
        },
        body: JSON.stringify({
          model: 'whisper-1',
          file: audio,
        }),
      });

      const data = await response.json();
      console.log('Transcription response:', data);

      return new Response(JSON.stringify({ text: data.text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid processing type');
  } catch (error) {
    console.error('Error in AI processing:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});