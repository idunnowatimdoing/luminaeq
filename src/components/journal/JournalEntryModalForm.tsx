import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Type } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AudioRecorder } from "./AudioRecorder";
import { VideoRecorder } from "./VideoRecorder";
import { PillarSelect } from "./PillarSelect";
import { MoodSelector } from "./MoodSelector";
import { TagInput } from "./TagInput";
import { handleJournalSubmission } from "./journalSubmissionHandler";
import { supabase } from "@/integrations/supabase/client";

interface JournalEntryModalFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function JournalEntryModalForm({ onSuccess, onClose }: JournalEntryModalFormProps) {
  const [entryText, setEntryText] = useState("");
  const [pillar, setPillar] = useState("");
  const [mood, setMood] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const validateEntry = () => {
    if (!entryText.trim() && !mediaBlob) {
      toast({
        title: "Missing content",
        description: "Please enter text or record media for your journal entry",
        variant: "destructive",
      });
      return false;
    }

    if (!pillar) {
      toast({
        title: "Missing fields",
        description: "Please select an EQ pillar",
        variant: "destructive",
      });
      return false;
    }

    if (!mood) {
      toast({
        title: "Missing fields",
        description: "Please select your current mood",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

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
    if (!validateEntry()) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      console.log("Starting journal entry submission...");
      
      const success = await handleJournalSubmission({
        user_id: user.id,
        entry_text: entryText,
        pillar,
        mood,
        type: activeTab,
        mediaBlob,
        tags
      });

      if (success) {
        toast({
          title: "Success",
          description: "Journal entry saved successfully",
        });
        onSuccess();
        onClose();
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
    <div className="grid gap-4 py-4">
      <div className="space-y-4">
        <PillarSelect value={pillar} onValueChange={setPillar} />
        
        <div className="space-y-2">
          <label className="text-sm font-medium">How are you feeling?</label>
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <TagInput tags={tags} onChange={setTags} />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Type className="h-4 w-4" /> Text
          </TabsTrigger>
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
}