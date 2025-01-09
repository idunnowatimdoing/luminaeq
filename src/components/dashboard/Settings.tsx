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

interface UserSettings {
  push_notifications: boolean;
  in_app_notifications: boolean;
  journaling_prompts: boolean;
  leaderboard_opt_out: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  storage_preference: 'local' | 'cloud';
  subscription_status: string;
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
    subscription_status: 'free'
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
    setupRealtimeSubscription();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .single();

      if (error) throw error;
      if (data) {
        setSettings(data);
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
      console.error("Error updating setting:", error);
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
      <CardContent>
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings 
              settings={settings}
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
            <MediaSettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};