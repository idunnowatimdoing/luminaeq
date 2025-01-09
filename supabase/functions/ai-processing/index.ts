import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

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

    // Handle sentiment analysis
    if (type === 'sentiment') {
      if (!text) {
        throw new Error('Text is required for sentiment analysis');
      }

      const apiKey = Deno.env.get('EQCompanion-Gemini');
      if (!apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

      console.log('Sending request to Gemini for sentiment analysis');
      
      const prompt = `Analyze the sentiment of the following text and return ONLY a JSON object with these exact fields:
      - sentiment: either "positive", "negative", or "neutral"
      - score: a number between 0 and 1 indicating the strength of the sentiment
      - dominant_emotion: one of "joy", "sadness", "anger", "fear", or "neutral"
      
      Text to analyze: "${text}"
      
      Return only the JSON object, no other text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      console.log('Raw Gemini response:', responseText);

      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }

        const sentimentData = JSON.parse(jsonMatch[0]);
        console.log('Processed sentiment data:', sentimentData);
        
        return new Response(JSON.stringify(sentimentData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('Error processing sentiment data:', parseError);
        throw new Error(`Failed to process sentiment data: ${parseError.message}`);
      }
    }

    // Handle transcription
    if (type === 'transcribe') {
      if (!audio) {
        throw new Error('Audio data is required for transcription');
      }

      const openAIKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAIKey) {
        throw new Error('OpenAI API key not configured');
      }

      console.log('Processing audio transcription request');

      // Convert base64 to blob
      const binaryString = atob(audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mp3' });

      const formData = new FormData();
      formData.append('model', 'whisper-1');
      formData.append('file', audioBlob, 'audio.mp3');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.error('Transcription API error:', await response.text());
        throw new Error('Failed to get transcription from OpenAI API');
      }

      const data = await response.json();
      console.log('Transcription completed:', data);

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