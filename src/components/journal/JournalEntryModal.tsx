import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Type } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AudioRecorder } from "./AudioRecorder";
import { VideoRecorder } from "./VideoRecorder";
import { PillarSelect } from "./PillarSelect";
import { MoodSelector } from "./MoodSelector";

interface JournalEntryModalProps {
  trigger?: React.ReactNode;
  onEntrySubmitted?: () => void;
}

export function JournalEntryModal({ trigger, onEntrySubmitted }: JournalEntryModalProps) {
  const [open, setOpen] = useState(false);
  const [entryText, setEntryText] = useState("");
  const [pillar, setPillar] = useState("");
  const [mood, setMood] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!entryText.trim()) {
      toast({
        title: "Missing fields",
        description: "Please enter some text for your journal entry",
        variant: "destructive",
      });
      return;
    }

    if (!pillar) {
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

      // Get sentiment analysis using new unified endpoint
      console.log("Requesting sentiment analysis...");
      const { data: sentimentData, error: sentimentError } = await supabase.functions.invoke('ai-processing', {
        body: { 
          text: entryText,
          type: 'sentiment'
        }
      });

      if (sentimentError) {
        console.error("Sentiment analysis error:", sentimentError);
        throw new Error("Failed to analyze sentiment");
      }

      console.log("Sentiment analysis completed:", sentimentData);

      // Prepare the entry data
      const entryData = {
        user_id: user.id,
        entry_text: entryText,
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

      toast({
        title: "Success",
        description: "Journal entry saved successfully",
      });

      setOpen(false);
      setEntryText("");
      setPillar("");
      setMood("");
      onEntrySubmitted?.();
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

  const handleMediaRecordingComplete = async (blob: Blob) => {
    try {
      // Convert blob to base64
      const base64Audio = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]);
        };
        reader.readAsDataURL(blob);
      });

      // Get transcription using new unified endpoint
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('ai-processing', {
        body: { 
          audio: base64Audio,
          type: 'transcribe'
        }
      });
      
      if (transcriptionError) {
        throw transcriptionError;
      }
      
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>New Journal Entry</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Journal Entry</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <PillarSelect value={pillar} onValueChange={setPillar} />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">How are you feeling?</label>
              <MoodSelector value={mood} onChange={setMood} />
            </div>
          </div>
          
          <Tabs defaultValue="text" className="w-full">
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
      </DialogContent>
    </Dialog>
  );
}