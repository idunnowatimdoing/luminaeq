import { supabase } from "@/integrations/supabase/client";
import { addDays } from "date-fns";

interface JournalSubmissionParams {
  user_id: string;
  entry_text: string;
  pillar: string;
  mood: string;
  type: string;
  mediaBlob?: Blob | null;
}

export const handleJournalSubmission = async ({
  user_id,
  entry_text,
  pillar,
  mood,
  type,
  mediaBlob
}: JournalSubmissionParams): Promise<boolean> => {
  console.log(`Processing ${type} journal entry...`);

  try {
    // Fetch user's media preferences
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("media_storage_enabled, media_retention_days, transcription_on_deletion")
      .eq("user_id", user_id)
      .single();

    if (profileError) {
      console.error("Error fetching profile settings:", profileError);
      throw profileError;
    }

    // Handle media upload if present and enabled
    let mediaEntry = null;
    if (mediaBlob && (type === 'audio' || type === 'video')) {
      if (!profileData.media_storage_enabled) {
        console.log("Media storage is disabled, processing transcription only");
        const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('ai-processing', {
          body: { 
            audio: await blobToBase64(mediaBlob),
            type: 'transcribe'
          }
        });

        if (transcriptionError) throw transcriptionError;
        entry_text = transcriptionData?.text || entry_text;
      } else {
        console.log("Processing media upload with retention settings");
        const filePath = `${user_id}/${crypto.randomUUID()}.${type === 'audio' ? 'webm' : 'mp4'}`;
        
        // Upload media file
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, mediaBlob);

        if (uploadError) throw uploadError;

        // Calculate expiration date based on retention days
        const expiresAt = addDays(new Date(), profileData.media_retention_days);

        // Create media entry record
        const { data: mediaData, error: mediaError } = await supabase
          .from('media_entries')
          .insert({
            user_id,
            entry_type: type,
            media_url: filePath,
            expires_at: expiresAt,
            size_bytes: mediaBlob.size
          })
          .select()
          .single();

        if (mediaError) throw mediaError;
        mediaEntry = mediaData;
      }
    }

    // Only perform sentiment analysis for text entries
    let sentimentData = null;
    if (type === 'text' || !profileData.media_storage_enabled) {
      console.log("Requesting sentiment analysis...");
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('ai-processing', {
        body: { 
          text: entry_text,
          type: 'sentiment'
        }
      });

      if (analysisError) {
        console.error("Sentiment analysis error:", analysisError);
        throw analysisError;
      }

      sentimentData = analysisData;
      console.log("Sentiment analysis completed:", sentimentData);
    }

    // Create journal entry
    const { error: insertError } = await supabase
      .from("journal_entries")
      .insert({
        user_id,
        entry_text,
        pillar,
        mood,
        sentiment_data: sentimentData,
        media_entry_id: mediaEntry?.id
      });

    if (insertError) throw insertError;

    console.log("Journal entry saved successfully");
    return true;
  } catch (error) {
    console.error("Error in journal submission:", error);
    throw error;
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};