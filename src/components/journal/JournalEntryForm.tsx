import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AudioRecorder } from "./AudioRecorder";
import { VideoRecorder } from "./VideoRecorder";
import { PillarSelect } from "./PillarSelect";
import { MoodSelector } from "./MoodSelector";
import { handleJournalSubmission } from "./journalSubmissionHandler";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JournalEntryFormProps {
  initialPillar: string;
}

export const JournalEntryForm = ({ initialPillar }: JournalEntryFormProps) => {
  const [entryText, setEntryText] = useState("");
  const [selectedPillar, setSelectedPillar] = useState(initialPillar);
  const [mood, setMood] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const handleMediaRecordingComplete = async (blob: Blob) => {
    setMediaBlob(blob);
    try {
      const base64Media = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]);
        };
        reader.readAsDataURL(blob);
      });

      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('ai-processing', {
        body: { 
          audio: base64Media,
          type: 'transcribe'
        }
      });
      
      if (transcriptionError) throw transcriptionError;
      
      if (transcriptionData?.text) {
        setEntryText(transcriptionData.text);
      }
    } catch (error: any) {
      console.error('Transcription error:', error);
      toast({
        title: "Error processing recording",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!entryText.trim() && !mediaBlob) {
      toast({
        title: "Missing content",
        description: "Please enter text or record media for your journal entry",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPillar) {
      toast({
        title: "Missing fields",
        description: "Please select an EQ pillar",
        variant: "destructive",
      });
      return;
    }

    if (!mood) {
      toast({
        title: "Missing fields",
        description: "Please select your current mood",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      console.log("Starting journal entry submission...");
      
      const success = await handleJournalSubmission({
        user_id: user.id,
        entry_text: entryText,
        pillar: selectedPillar,
        mood,
        type: activeTab,
        mediaBlob
      });

      if (success) {
        toast({
          title: "Success",
          description: "Journal entry saved successfully",
        });
        setEntryText("");
        setMood("");
        setMediaBlob(null);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Error saving journal entry",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <PillarSelect value={selectedPillar} onValueChange={setSelectedPillar} />
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">How are you feeling?</label>
          <MoodSelector value={mood} onChange={setMood} />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <Textarea
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            placeholder="Write your thoughts here..."
            className="h-32"
          />
        </TabsContent>
        
        <TabsContent value="audio">
          <AudioRecorder onRecordingComplete={handleMediaRecordingComplete} />
        </TabsContent>
        
        <TabsContent value="video">
          <VideoRecorder onRecordingComplete={handleMediaRecordingComplete} />
        </TabsContent>
      </Tabs>
      
      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Saving..." : "Save Entry"}
      </Button>
    </div>
  );
};