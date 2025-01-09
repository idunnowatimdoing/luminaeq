import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaSettings } from "./MediaSettings";
import { Card } from "@/components/ui/card";
import { useMediaSettings } from "@/hooks/useMediaSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Settings() {
  const { settings, loading, error } = useMediaSettings();

  if (loading) {
    return <div>Loading settings...</div>;
  }

  if (error) {
    return <div>Error loading settings: {error.message}</div>;
  }

  if (!settings) {
    return <div>No settings found</div>;
  }

  const handleUpdate = async (key: string, value: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [key]: value })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast.success('Settings updated successfully');
    } catch (err: any) {
      console.error('Error updating settings:', err);
      toast.error('Failed to update settings');
    }
  };

  return (
    <Tabs defaultValue="media" className="w-full">
      <TabsList>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="media">
        <MediaSettings 
          mediaStorageEnabled={settings.mediaStorageEnabled}
          transcriptionOnDeletion={settings.transcriptionOnDeletion}
          retentionDays={settings.mediaRetentionDays}
          onUpdate={handleUpdate}
        />
      </TabsContent>
      
      <TabsContent value="account">
        <Card>
          {/* Account settings content */}
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications">
        <Card>
          {/* Notifications settings content */}
        </Card>
      </TabsContent>
    </Tabs>
  );
}