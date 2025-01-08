import { useEffect, useState } from "react";
import { ScrollText, Smile, Frown, Meh, Angry } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface JournalEntry {
  id: string;
  entry_text: string;
  pillar: string | null;
  mood: string | null;
  created_at: string;
}

const moodIcons = {
  happy: Smile,
  sad: Frown,
  neutral: Meh,
  angry: Angry,
};

export const EntryHistory = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
    setupRealtimeSubscription();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching journal entries",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("journal-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "journal_entries" },
        (payload) => {
          console.log("Journal entry update received:", payload);
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const formatPillar = (pillar: string | null): string => {
    if (!pillar) return "General";
    return pillar.charAt(0).toUpperCase() + pillar.slice(1).replace("_", " ");
  };

  const getMoodIcon = (mood: string | null) => {
    if (!mood || !(mood in moodIcons)) return null;
    const Icon = moodIcons[mood as keyof typeof moodIcons];
    return <Icon className="h-5 w-5" />;
  };

  return (
    <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-white">Journal History</CardTitle>
        <ScrollText className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.length === 0 ? (
          <p className="text-gray-400">No journal entries yet</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-lg bg-gray-700/30"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white capitalize">
                    {formatPillar(entry.pillar)}
                  </span>
                  {entry.mood && (
                    <span className="text-gray-400">
                      {getMoodIcon(entry.mood)}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-300 mt-2 line-clamp-3">{entry.entry_text}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}