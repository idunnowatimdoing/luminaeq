import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  settings: {
    push_notifications: boolean;
    in_app_notifications: boolean;
    journaling_prompts: boolean;
  };
  onUpdate: (key: string, value: boolean) => void;
}

export const NotificationSettings = ({ settings, onUpdate }: NotificationSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="push-notifications" className="text-white">
          Push Notifications
        </Label>
        <Switch
          id="push-notifications"
          checked={settings.push_notifications}
          onCheckedChange={(checked) => onUpdate("push_notifications", checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="in-app-notifications" className="text-white">
          In-app Notifications
        </Label>
        <Switch
          id="in-app-notifications"
          checked={settings.in_app_notifications}
          onCheckedChange={(checked) => onUpdate("in_app_notifications", checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="journaling-prompts" className="text-white">
          Journaling Prompts
        </Label>
        <Switch
          id="journaling-prompts"
          checked={settings.journaling_prompts}
          onCheckedChange={(checked) => onUpdate("journaling_prompts", checked)}
        />
      </div>
    </div>
  );
};