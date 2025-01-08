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
    console.log(`Processing ${type} request with content:`, type === 'sentiment' ? text : 'audio file');

    if (type === 'sentiment') {
      console.log('Sending request to OpenAI for sentiment analysis');
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
              content: 'You are a sentiment analysis assistant. Analyze the following text and return ONLY a valid JSON object with these exact fields: sentiment (string: "positive", "negative", or "neutral"), score (number between 0 and 1), and dominant_emotion (string: "joy", "sadness", "anger", "fear", or "neutral"). Do not include any other text or explanation.'
            },
            { role: 'user', content: text }
          ],
        }),
      });

      const data = await response.json();
      console.log('Raw OpenAI response:', data);

      if (!data.choices?.[0]?.message?.content) {
        console.error('Invalid OpenAI response structure:', data);
        throw new Error('Invalid response structure from OpenAI');
      }

      try {
        // Parse the response content as JSON
        const sentimentData = JSON.parse(data.choices[0].message.content);
        console.log('Parsed sentiment data:', sentimentData);

        // Validate the required fields
        if (!sentimentData.sentiment || !sentimentData.score || !sentimentData.dominant_emotion) {
          console.error('Missing required fields in sentiment data:', sentimentData);
          throw new Error('Missing required fields in sentiment analysis');
        }

        return new Response(JSON.stringify(sentimentData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('Error parsing OpenAI response as JSON:', parseError);
        throw new Error('Invalid JSON format in OpenAI response');
      }
    }

    if (type === 'transcribe') {
      console.log('Sending request to OpenAI for transcription');
      const formData = new FormData();
      formData.append('model', 'whisper-1');
      
      // Convert base64 to blob
      const binaryString = atob(audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mp3' });
      formData.append('file', audioBlob, 'audio.mp3');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Transcription response:', data);

      if (!data.text) {
        console.error('Invalid transcription response:', data);
        throw new Error('Invalid transcription response');
      }

      return new Response(JSON.stringify({ text: data.text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid processing type');
  } catch (error) {
    console.error('Error in AI processing:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});