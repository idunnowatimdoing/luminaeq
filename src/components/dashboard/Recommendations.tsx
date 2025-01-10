import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Recommendations = () => {
  const [latestRecommendation, setLatestRecommendation] = useState<string>("");

  useEffect(() => {
    // Fetch initial recommendations
    const fetchRecommendations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('title', 'AI Recommendation')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setLatestRecommendation(data[0].content);
      }
    };

    fetchRecommendations();

    // Set up real-time subscription
    const channel = supabase
      .channel('recommendations-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: 'title=eq.AI Recommendation'
        },
        (payload) => {
          console.log('New recommendation received:', payload);
          if (payload.new && 'content' in payload.new) {
            setLatestRecommendation(payload.new.content as string);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl text-white">Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-gray-300">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-4 bg-[#00ffd5] rounded" />
          <p>{latestRecommendation || "Loading recommendations..."}</p>
        </div>
      </CardContent>
    </Card>
  );
};