import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

export const AudioRecorder = ({ onRecordingComplete }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    chunksRef.current = [];
    try {
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      
      streamRef.current = stream;

      // Create and configure MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4'
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("Recording stopped, processing chunks...");
        const blob = new Blob(chunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        setAudioBlob(blob);
        onRecordingComplete(blob);
        
        // Cleanup
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setRecordingTime(0);
      };

      // Start recording
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      console.log("Recording started successfully");

      // Start timer
      let startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingTime(elapsed);

        // Auto-stop after 3 minutes
        if (elapsed >= 180) {
          stopRecording();
          toast({
            title: "Recording completed",
            description: "Maximum recording duration reached (3 minutes)",
          });
        }
      }, 100);

    } catch (error: any) {
      console.error('Recording error:', error);
      toast({
        title: "Recording Error",
        description: error.message || "Failed to start recording",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log("Stopping recording...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button 
        onClick={() => isRecording ? stopRecording() : startRecording()}
        variant={isRecording ? "destructive" : "default"}
        className="flex items-center gap-2"
      >
        {isRecording ? (
          <>
            <StopCircle className="h-4 w-4" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            Start Recording
          </>
        )}
      </Button>
      
      {isRecording && (
        <div className="text-sm font-medium">
          {formatTime(recordingTime)}
        </div>
      )}

      {audioBlob && (
        <audio 
          controls 
          src={URL.createObjectURL(audioBlob)} 
          className="w-full max-w-xs"
        />
      )}
    </div>
  );
};