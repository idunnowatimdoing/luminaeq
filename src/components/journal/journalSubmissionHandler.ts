import { supabase } from "@/integrations/supabase/client";

interface JournalSubmissionParams {
  user_id: string;
  entry_text: string;
  pillar: string;
  mood: string;
  type: string;
}

export const handleJournalSubmission = async ({
  user_id,
  entry_text,
  pillar,
  mood,
  type
}: JournalSubmissionParams): Promise<boolean> => {
  console.log(`Processing ${type} journal entry...`);

  // Only perform sentiment analysis for text entries
  let sentimentData = null;
  if (type === 'text') {
    console.log("Requesting sentiment analysis...");
    const { data: analysisData, error: analysisError } = await supabase.functions.invoke('ai-processing', {
      body: { 
        text: entry_text,
        type: 'sentiment'
      }
    });

    if (analysisError) {
      console.error("Sentiment analysis error:", analysisError);
      throw new Error("Failed to analyze sentiment");
    }

    sentimentData = analysisData;
    console.log("Sentiment analysis completed:", sentimentData);
  }

  // Prepare the entry data
  const entryData = {
    user_id,
    entry_text,
    pillar,
    mood,
    sentiment_data: sentimentData
  };

  console.log("Inserting journal entry:", entryData);

  const { error: insertError } = await supabase
    .from("journal_entries")
    .insert(entryData);

  if (insertError) {
    console.error("Database insertion error:", insertError);
    throw insertError;
  }

  console.log("Journal entry saved successfully");
  return true;
};