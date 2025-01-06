import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

export const AudioRecorder = ({ onRecordingComplete }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        onRecordingComplete(blob);
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
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button 
        onClick={() => isRecording ? stopRecording() : startRecording()}
        variant={isRecording ? "destructive" : "default"}
        className="flex items-center gap-2"
      >
        <Mic className="h-4 w-4" />
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      {audioBlob && (
        <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
      )}
    </div>
  );
};