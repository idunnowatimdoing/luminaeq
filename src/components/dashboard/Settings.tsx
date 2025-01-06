import { useEffect, useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UserSettings {
  push_notifications: boolean;
  in_app_notifications: boolean;
  journaling_prompts: boolean;
  leaderboard_opt_out: boolean;
}

export const Settings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    push_notifications: true,
    in_app_notifications: true,
    journaling_prompts: true,
    leaderboard_opt_out: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
    setupRealtimeSubscription();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("push_notifications, in_app_notifications, journaling_prompts, leaderboard_opt_out")
        .single();

      if (error) throw error;
      if (data) {
        setSettings(data);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching settings",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("settings-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          console.log("Settings update received:", payload);
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateSetting = async (key: keyof UserSettings, value: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ [key]: value })
        .not("id", "is", null);

      if (error) throw error;
      setSettings((prev) => ({ ...prev, [key]: value }));
      
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-white">Settings</CardTitle>
        <SettingsIcon className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications" className="text-white">
            Push Notifications
          </Label>
          <Switch
            id="push-notifications"
            checked={settings.push_notifications}
            onCheckedChange={(checked) => updateSetting("push_notifications", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="in-app-notifications" className="text-white">
            In-app Notifications
          </Label>
          <Switch
            id="in-app-notifications"
            checked={settings.in_app_notifications}
            onCheckedChange={(checked) => updateSetting("in_app_notifications", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="journaling-prompts" className="text-white">
            Journaling Prompts
          </Label>
          <Switch
            id="journaling-prompts"
            checked={settings.journaling_prompts}
            onCheckedChange={(checked) => updateSetting("journaling_prompts", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="leaderboard-opt-out" className="text-white">
            Opt out of Leaderboard
          </Label>
          <Switch
            id="leaderboard-opt-out"
            checked={settings.leaderboard_opt_out}
            onCheckedChange={(checked) => updateSetting("leaderboard_opt_out", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};