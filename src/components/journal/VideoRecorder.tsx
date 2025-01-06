import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

export const VideoRecorder = ({ onRecordingComplete }: VideoRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
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
        <Video className="h-4 w-4" />
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      {videoBlob && (
        <video controls src={URL.createObjectURL(videoBlob)} className="w-full" />
      )}
    </div>
  );
};