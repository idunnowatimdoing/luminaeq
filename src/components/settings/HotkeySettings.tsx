import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface HotkeySettingsProps {
  hotkeySettings: {
    newEntry: string;
    viewHistory: string;
    viewInsights: string;
    viewSettings: string;
    viewChallenges: string;
  };
  onUpdate: (settings: any) => void;
}

export const HotkeySettings = ({ hotkeySettings, onUpdate }: HotkeySettingsProps) => {
  const [settings, setSettings] = useState(hotkeySettings);

  const handleSave = () => {
    onUpdate(settings);
    toast.success('Hotkey settings updated');
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="newEntry">New Entry</Label>
          <Input
            id="newEntry"
            value={settings.newEntry}
            onChange={(e) => setSettings({ ...settings, newEntry: e.target.value })}
            placeholder="Alt+N"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="viewHistory">View History</Label>
          <Input
            id="viewHistory"
            value={settings.viewHistory}
            onChange={(e) => setSettings({ ...settings, viewHistory: e.target.value })}
            placeholder="Alt+H"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="viewInsights">View Insights</Label>
          <Input
            id="viewInsights"
            value={settings.viewInsights}
            onChange={(e) => setSettings({ ...settings, viewInsights: e.target.value })}
            placeholder="Alt+I"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="viewSettings">View Settings</Label>
          <Input
            id="viewSettings"
            value={settings.viewSettings}
            onChange={(e) => setSettings({ ...settings, viewSettings: e.target.value })}
            placeholder="Alt+S"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="viewChallenges">View Challenges</Label>
          <Input
            id="viewChallenges"
            value={settings.viewChallenges}
            onChange={(e) => setSettings({ ...settings, viewChallenges: e.target.value })}
            placeholder="Alt+C"
          />
        </div>
      </div>
      
      <Button onClick={handleSave} className="w-full">
        Save Hotkey Settings
      </Button>
    </div>
  );
};