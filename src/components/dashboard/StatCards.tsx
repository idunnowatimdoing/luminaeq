import { Award, Mountain, GraduationCap, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Recommendation {
  id: string;
  content: string;
  created_at: string;
}

export const StatCards = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
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

  const cards = [
    {
      title: "Recommendations",
      icon: Lightbulb,
      content: latestRecommendation || "Loading recommendations..."
    },
    {
      title: "Achievements",
      icon: Award,
    },
    {
      title: "Challenges",
      icon: Mountain,
    },
    {
      title: "Learning",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="bg-black/40 backdrop-blur-lg border-gray-800">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <h3 className="text-xl font-semibold text-white mb-4">{card.title}</h3>
              <div className="relative mb-2">
                <Icon 
                  size={32} 
                  className="text-[#00ffd5]"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(0, 255, 213, 0.5))"
                  }}
                />
              </div>
              {card.content && (
                <p className="text-sm text-gray-300 text-center mt-2">
                  {card.content}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};