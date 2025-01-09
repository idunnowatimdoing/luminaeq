import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaSettings } from "./MediaSettings";
import { Card } from "@/components/ui/card";

export function Settings() {
  return (
    <Tabs defaultValue="media" className="w-full">
      <TabsList>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="media">
        <MediaSettings />
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