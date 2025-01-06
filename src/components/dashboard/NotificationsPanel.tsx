import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  title: string;
  content: string;
  created_at: string;
  read: boolean;
}

export const NotificationsPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    setupRealtimeSubscription();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching notifications",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          console.log("Messages update received:", payload);
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("id", messageId);

      if (error) throw error;
      fetchMessages();
    } catch (error: any) {
      toast({
        title: "Error updating message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-white">Notifications</CardTitle>
        <Bell className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-400">No notifications</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.read ? "bg-gray-700/30" : "bg-gray-700/50"
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-white">{message.title}</h4>
                {!message.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(message.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </div>
              <p className="text-gray-300 mt-1">{message.content}</p>
              <span className="text-sm text-gray-400 mt-2 block">
                {new Date(message.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};