import { useState, useEffect } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AccountSettings } from "../settings/AccountSettings";
import { NotificationSettings } from "../settings/NotificationSettings";
import { AppearanceSettings } from "../settings/AppearanceSettings";
import { PrivacySettings } from "../settings/PrivacySettings";
import { MediaSettings } from "../settings/MediaSettings";
import { HotkeySettings } from "../settings/HotkeySettings";

interface UserSettings {
  push_notifications: boolean;
  in_app_notifications: boolean;
  journaling_prompts: boolean;
  leaderboard_opt_out: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  storage_preference: 'local' | 'cloud';
  subscription_status: string;
  media_storage_enabled: boolean;
  transcription_on_deletion: boolean;
  media_retention_days: number;
  hotkey_settings: {
    newEntry: string;
    viewHistory: string;
    viewInsights: string;
    viewSettings: string;
    viewChallenges: string;
  };
}

export const Settings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    push_notifications: true,
    in_app_notifications: true,
    journaling_prompts: true,
    leaderboard_opt_out: false,
    theme: 'system',
    language: 'en-US',
    storage_preference: 'cloud',
    subscription_status: 'free',
    media_storage_enabled: true,
    transcription_on_deletion: false,
    media_retention_days: 30,
    hotkey_settings: {
      newEntry: 'Alt+N',
      viewHistory: 'Alt+H',
      viewInsights: 'Alt+I',
      viewSettings: 'Alt+S',
      viewChallenges: 'Alt+C'
    }
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
    setupRealtimeSubscription();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setSettings({
          push_notifications: data.push_notifications,
          in_app_notifications: data.in_app_notifications,
          journaling_prompts: data.journaling_prompts,
          leaderboard_opt_out: data.leaderboard_opt_out,
          theme: data.theme || 'system',
          language: data.language || 'en-US',
          storage_preference: data.storage_preference || 'cloud',
          subscription_status: data.subscription_status || 'free',
          media_storage_enabled: data.media_storage_enabled,
          transcription_on_deletion: data.transcription_on_deletion,
          media_retention_days: data.media_retention_days,
          hotkey_settings: data.hotkey_settings || {
            newEntry: 'Alt+N',
            viewHistory: 'Alt+H',
            viewInsights: 'Alt+I',
            viewSettings: 'Alt+S',
            viewChallenges: 'Alt+C'
          }
        });
      }
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching settings:", error);
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

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from("profiles")
        .update({ [key]: value })
        .eq("user_id", user.id);

      if (error) throw error;
      setSettings((prev) => ({ ...prev, [key]: value }));
      
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved.",
      });
    } catch (error: any) {
      console.error("Error updating setting:", error);
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-white">Settings</CardTitle>
        <SettingsIcon className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="hotkeys">Hotkeys</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountSettings 
              language={settings.language}
              storagePreference={settings.storage_preference}
              onUpdate={updateSetting}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings 
              settings={{
                push_notifications: settings.push_notifications,
                in_app_notifications: settings.in_app_notifications,
                journaling_prompts: settings.journaling_prompts
              }}
              onUpdate={updateSetting}
            />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceSettings 
              theme={settings.theme}
              onUpdate={(value) => updateSetting('theme', value)}
            />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacySettings 
              leaderboardOptOut={settings.leaderboard_opt_out}
              onUpdate={(value) => updateSetting('leaderboard_opt_out', value)}
            />
          </TabsContent>

          <TabsContent value="media">
            <MediaSettings 
              mediaStorageEnabled={settings.media_storage_enabled}
              transcriptionOnDeletion={settings.transcription_on_deletion}
              retentionDays={settings.media_retention_days}
              onUpdate={updateSetting}
            />
          </TabsContent>

          <TabsContent value="hotkeys">
            <HotkeySettings
              hotkeySettings={settings.hotkey_settings}
              onUpdate={(value) => updateSetting('hotkey_settings', value)}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};