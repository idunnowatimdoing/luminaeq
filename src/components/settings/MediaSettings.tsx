import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const MediaSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mediaStorageEnabled, setMediaStorageEnabled] = useState(true);
  const [transcriptionOnDeletion, setTranscriptionOnDeletion] = useState(false);
  const [retentionDays, setRetentionDays] = useState(30);
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from('profiles')
        .update({
          media_storage_enabled: mediaStorageEnabled,
          transcription_on_deletion: transcriptionOnDeletion,
          media_retention_days: retentionDays,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your media preferences have been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Media Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="media-storage">Enable Media Storage</Label>
            <p className="text-sm text-gray-500">
              Store audio and video entries for later review
            </p>
          </div>
          <Switch
            id="media-storage"
            checked={mediaStorageEnabled}
            onCheckedChange={setMediaStorageEnabled}
          />
        </div>

        {mediaStorageEnabled && (
          <>
            <div className="space-y-4">
              <Label>Media Retention Period (Days)</Label>
              <Slider
                value={[retentionDays]}
                onValueChange={(value) => setRetentionDays(value[0])}
                max={90}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Media will be automatically deleted after {retentionDays} days
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="transcription">Transcribe on Deletion</Label>
                <p className="text-sm text-gray-500">
                  Keep text transcripts when media is deleted
                </p>
              </div>
              <Switch
                id="transcription"
                checked={transcriptionOnDeletion}
                onCheckedChange={setTranscriptionOnDeletion}
              />
            </div>
          </>
        )}

        <button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </button>
      </CardContent>
    </Card>
  );
};