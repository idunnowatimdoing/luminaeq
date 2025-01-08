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
              content: 'You are a sentiment analysis assistant. Return a JSON object with sentiment (positive/negative/neutral), score (0-1), and dominant_emotion (joy/sadness/anger/fear/neutral). Example: {"sentiment": "positive", "score": 0.8, "dominant_emotion": "joy"}'
            },
            { role: 'user', content: text }
          ],
          temperature: 0.3, // Lower temperature for more consistent results
        }),
      });

      if (!response.ok) {
        console.error('OpenAI API error:', await response.text());
        throw new Error('Failed to get response from OpenAI API');
      }

      const data = await response.json();
      console.log('Raw OpenAI response:', data);

      if (!data.choices?.[0]?.message?.content) {
        console.error('Invalid OpenAI response structure:', data);
        throw new Error('Invalid response structure from OpenAI');
      }

      try {
        let sentimentData;
        const content = data.choices[0].message.content;
        
        // Try to extract JSON if it's wrapped in text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        
        try {
          sentimentData = JSON.parse(jsonStr);
        } catch (e) {
          console.error('Failed to parse JSON directly:', e);
          throw new Error('Invalid JSON format in OpenAI response');
        }

        // Validate the required fields
        if (!sentimentData.sentiment || 
            !sentimentData.score || 
            !sentimentData.dominant_emotion ||
            typeof sentimentData.score !== 'number' ||
            sentimentData.score < 0 || 
            sentimentData.score > 1) {
          console.error('Invalid sentiment data structure:', sentimentData);
          throw new Error('Invalid sentiment data structure');
        }

        // Ensure values are within expected ranges
        const validSentiments = ['positive', 'negative', 'neutral'];
        const validEmotions = ['joy', 'sadness', 'anger', 'fear', 'neutral'];

        if (!validSentiments.includes(sentimentData.sentiment)) {
          sentimentData.sentiment = 'neutral';
        }

        if (!validEmotions.includes(sentimentData.dominant_emotion)) {
          sentimentData.dominant_emotion = 'neutral';
        }

        console.log('Validated sentiment data:', sentimentData);
        return new Response(JSON.stringify(sentimentData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('Error processing sentiment data:', parseError);
        throw new Error(`Failed to process sentiment data: ${parseError.message}`);
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

      if (!response.ok) {
        console.error('Transcription API error:', await response.text());
        throw new Error('Failed to get transcription from OpenAI API');
      }

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