import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Video, Type } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface JournalEntryModalProps {
  trigger?: React.ReactNode;
  onEntrySubmitted?: () => void;
}

export function JournalEntryModal({ trigger, onEntrySubmitted }: JournalEntryModalProps) {
  const [open, setOpen] = useState(false);
  const [entryText, setEntryText] = useState("");
  const [pillar, setPillar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const startRecording = async (mediaType: 'audio' | 'video') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: mediaType === 'video'
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { 
          type: mediaType === 'audio' ? 'audio/webm' : 'video/webm' 
        });
        if (mediaType === 'audio') {
          setAudioBlob(blob);
        } else {
          setVideoBlob(blob);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Stop recording after 3 minutes
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
        }
      }, 180000);
      
    } catch (error: any) {
      console.error('Recording error:', error);
      toast({
        title: "Recording Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleSubmit = async () => {
    if (!pillar) {
      toast({
        title: "Missing fields",
        description: "Please select an EQ pillar",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let entry_text = entryText;
      let entry_audio = null;
      
      // Process audio if present
      if (audioBlob) {
        const base64Audio = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]);
          };
          reader.readAsDataURL(audioBlob);
        });

        const { data: transcriptionData } = await supabase.functions.invoke('transcribe-audio', {
          body: { audio: base64Audio }
        });
        
        if (transcriptionData?.text) {
          entry_text = transcriptionData.text;
        }
      }

      // Get sentiment analysis
      const { data: sentimentData } = await supabase.functions.invoke('analyze-sentiment', {
        body: { text: entry_text }
      });

      const { error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: user.id,
          entry_text,
          entry_audio,
          pillar,
          sentiment_data: sentimentData
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journal entry saved successfully",
      });

      setOpen(false);
      setEntryText("");
      setPillar("");
      setAudioBlob(null);
      setVideoBlob(null);
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
          <div className="grid gap-2">
            <Label htmlFor="pillar">EQ Pillar</Label>
            <Select value={pillar} onValueChange={setPillar}>
              <SelectTrigger>
                <SelectValue placeholder="Select a pillar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self_awareness">Self Awareness</SelectItem>
                <SelectItem value="self_regulation">Self Regulation</SelectItem>
                <SelectItem value="motivation">Motivation</SelectItem>
                <SelectItem value="empathy">Empathy</SelectItem>
                <SelectItem value="social_skills">Social Skills</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="h-4 w-4" /> Text
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Mic className="h-4 w-4" /> Audio
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="h-4 w-4" /> Video
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text">
              <Textarea
                id="entry"
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                placeholder="Write your thoughts here..."
                className="h-32"
              />
            </TabsContent>
            
            <TabsContent value="audio">
              <div className="flex flex-col items-center gap-4">
                <Button 
                  onClick={() => isRecording ? stopRecording() : startRecording('audio')}
                  variant={isRecording ? "destructive" : "default"}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
                {audioBlob && (
                  <audio controls src={URL.createObjectURL(audioBlob)} />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="video">
              <div className="flex flex-col items-center gap-4">
                <Button 
                  onClick={() => isRecording ? stopRecording() : startRecording('video')}
                  variant={isRecording ? "destructive" : "default"}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
                {videoBlob && (
                  <video controls src={URL.createObjectURL(videoBlob)} className="w-full" />
                )}
              </div>
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