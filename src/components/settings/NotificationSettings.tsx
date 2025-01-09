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
        <div className="space-y-0.5">
          <Label htmlFor="push-notifications" className="text-white">
            Push Notifications
          </Label>
          <p className="text-sm text-gray-400">
            Receive notifications even when you're not using the app
          </p>
        </div>
        <Switch
          id="push-notifications"
          checked={settings.push_notifications}
          onCheckedChange={(checked) => onUpdate("push_notifications", checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="in-app-notifications" className="text-white">
            In-app Notifications
          </Label>
          <p className="text-sm text-gray-400">
            Receive notifications while using the app
          </p>
        </div>
        <Switch
          id="in-app-notifications"
          checked={settings.in_app_notifications}
          onCheckedChange={(checked) => onUpdate("in_app_notifications", checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="journaling-prompts" className="text-white">
            Journaling Prompts
          </Label>
          <p className="text-sm text-gray-400">
            Receive daily prompts to help with journaling
          </p>
        </div>
        <Switch
          id="journaling-prompts"
          checked={settings.journaling_prompts}
          onCheckedChange={(checked) => onUpdate("journaling_prompts", checked)}
        />
      </div>
    </div>
  );
};