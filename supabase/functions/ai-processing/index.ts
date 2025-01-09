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
    const { text, type, audio, video } = await req.json();
    console.log(`Processing ${type} request with Gemini 1.5 Pro`);

    const apiKey = Deno.env.get('EQCompanion-Gemini');
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Handle different content types
    if (type === 'sentiment') {
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

    // Handle audio/video content in a single call
    if (type === 'transcribe') {
      if (!audio && !video) {
        throw new Error('Audio or video data is required for transcription');
      }

      const mediaType = audio ? 'audio' : 'video';
      const mediaContent = audio || video;

      const prompt = `Process this ${mediaType} content and return ONLY a JSON object with:
      - transcription: the full text transcription
      - sentiment_analysis: {
          sentiment: "positive", "negative", or "neutral",
          score: 0-1 indicating strength,
          dominant_emotion: "joy", "sadness", "anger", "fear", or "neutral",
          confidence_level: 0-1 indicating analysis confidence
        }
      - key_points: array of main points discussed
      
      Return only the JSON object, no other text.`;

      // Process audio/video content
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }, { inlineData: { data: mediaContent, mimeType: `${mediaType}/webm` } }] }],
      });

      const response = await result.response;
      const analysisData = JSON.parse(response.text());
      
      console.log(`${mediaType} analysis completed:`, analysisData);

      return new Response(JSON.stringify(analysisData), {
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