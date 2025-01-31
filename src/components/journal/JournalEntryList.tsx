import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface JournalEntry {
  id: string;
  created_at: string;
  mood: string;
  entry_text: string;
  entry_audio?: string;
  tags?: string[];
}

interface JournalEntryListProps {
  entries?: JournalEntry[];
  isLoading: boolean;
}

export const JournalEntryList = ({ entries, isLoading }: JournalEntryListProps) => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      {isLoading ? (
        <p className="text-gray-400">Loading entries...</p>
      ) : entries?.length === 0 ? (
        <p className="text-gray-400">No entries yet. Start journaling!</p>
      ) : (
        <div className="space-y-4">
          {entries?.map((entry) => (
            <Card key={entry.id} className="bg-black/40 border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-gray-200">
                    {format(new Date(entry.created_at), 'MMM d, yyyy h:mm a')}
                  </CardTitle>
                  <span className="text-sm text-gray-400 capitalize">{entry.mood}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 whitespace-pre-wrap">{entry.entry_text}</p>
                {entry.entry_audio && (
                  <audio controls className="mt-2 w-full" src={entry.entry_audio} />
                )}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};