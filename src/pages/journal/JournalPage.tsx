import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudioRecorder } from "@/components/journal/AudioRecorder";
import { VideoRecorder } from "@/components/journal/VideoRecorder";
import { PillarSelect } from "@/components/journal/PillarSelect";
import { MoodSelector } from "@/components/journal/MoodSelector";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { handleJournalSubmission } from "@/components/journal/journalSubmissionHandler";
import { supabase } from "@/integrations/supabase/client";

export const JournalPage = () => {
  const { pillar } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [entryText, setEntryText] = useState("");
  const [selectedPillar, setSelectedPillar] = useState(pillar?.replace(/_/g, ' ') || "");
  const [mood, setMood] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);

  const formatPillarName = (pillar: string) => {
    return pillar
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
    <div className="min-h-screen bg-[#051527] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:text-primary"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-white">
            {formatPillarName(pillar || '')} Journal
          </h1>
        </div>

        {/* Two-page spread layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left page - Journal Entry Creation */}
          <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-gray-800 space-y-6">
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

          {/* Right page - Previous Entries */}
          <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Previous Entries</h2>
            <p className="text-gray-400">Previous entries will be displayed here...</p>
          </div>
        </div>
      </div>
    </div>
  );
};