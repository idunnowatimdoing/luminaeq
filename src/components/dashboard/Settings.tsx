import { useEffect, useState } from "react";
import { Settings as SettingsIcon, LogOut, HelpCircle, Trash2, Download, Moon, Sun, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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

interface SocialConnection {
  platform: string;
  connection_status: boolean;
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
  const [socialConnections, setSocialConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
    fetchSocialConnections();
    setupRealtimeSubscription();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("push_notifications, in_app_notifications, journaling_prompts, leaderboard_opt_out, theme, language, storage_preference, subscription_status")
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

  const fetchSocialConnections = async () => {
    try {
      const { data, error } = await supabase
        .from("social_connections")
        .select("*");

      if (error) throw error;
      if (data) {
        setSocialConnections(data);
      }
    } catch (error: any) {
      console.error("Error fetching social connections:", error);
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

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExportData = async () => {
    // Implementation for data export
    toast({
      title: "Export started",
      description: "Your data export has been initiated. You'll be notified when it's ready.",
    });
  };

  const handleDeleteAccount = async () => {
    // Implementation for account deletion
    toast({
      title: "Account deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive",
    });
  };

  return (
    <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-white">Settings</CardTitle>
        <SettingsIcon className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4">
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
              
              <div className="space-y-2">
                <Label className="text-white">Storage Preference</Label>
                <Select
                  value={settings.storage_preference}
                  onValueChange={(value) => updateSetting('storage_preference', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select storage preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSetting('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
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
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value: 'light' | 'dark' | 'system') => updateSetting('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <Monitor className="mr-2 h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-4">
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

              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleExportData}
              >
                <Download className="mr-2 h-4 w-4" /> Export My Data
              </Button>

              <Button 
                variant="destructive" 
                className="w-full justify-start" 
                onClick={handleDeleteAccount}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Account
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('https://help.example.com', '_blank')}
              >
                <HelpCircle className="mr-2 h-4 w-4" /> Help Center
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};