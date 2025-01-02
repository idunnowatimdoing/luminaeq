import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  pillar: string;
}

export const JournalEntryModal = ({ isOpen, onClose, pillar }: JournalEntryModalProps) => {
  const [entryText, setEntryText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const handleSubmit = async () => {
    if (!entryText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text for your journal entry",
        variant: "destructive",
      });
      return;
    }

    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a journal entry",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: session.user.id,
          entry_text: entryText,
          pillar: pillar.toLowerCase(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journal entry saved successfully",
      });
      
      setEntryText("");
      onClose();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Journal Entry - {pillar}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="audio" disabled>Audio (Coming Soon)</TabsTrigger>
            <TabsTrigger value="video" disabled>Video (Coming Soon)</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <Textarea
              placeholder="Write your thoughts..."
              className="min-h-[200px]"
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="audio">
            <div className="p-4 text-center text-muted-foreground">
              Audio journal entries coming soon!
            </div>
          </TabsContent>

          <TabsContent value="video">
            <div className="p-4 text-center text-muted-foreground">
              Video journal entries coming soon!
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};