import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface MediaSettingsProps {
  mediaStorageEnabled: boolean;
  transcriptionOnDeletion: boolean;
  retentionDays: number;
  onUpdate: (key: string, value: any) => void;
}

export const MediaSettings = ({ 
  mediaStorageEnabled, 
  transcriptionOnDeletion, 
  retentionDays,
  onUpdate 
}: MediaSettingsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdate('media_storage_enabled', mediaStorageEnabled);
      await onUpdate('transcription_on_deletion', transcriptionOnDeletion);
      await onUpdate('media_retention_days', retentionDays);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
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
            onCheckedChange={(checked) => onUpdate('media_storage_enabled', checked)}
          />
        </div>

        {mediaStorageEnabled && (
          <>
            <div className="space-y-4">
              <Label>Media Retention Period (Days)</Label>
              <Slider
                value={[retentionDays]}
                onValueChange={(value) => onUpdate('media_retention_days', value[0])}
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
                onCheckedChange={(checked) => onUpdate('transcription_on_deletion', checked)}
              />
            </div>
          </>
        )}

        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};