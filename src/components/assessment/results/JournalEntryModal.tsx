import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MAX_CHARS = 2000;

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  pillar: string;
  gradientClass?: string;
}

export const JournalEntryModal = ({ 
  isOpen, 
  onClose, 
  pillar,
  gradientClass 
}: JournalEntryModalProps) => {
  const [entryText, setEntryText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const handleSubmit = async () => {
    console.log("Starting journal entry submission...");
    
    if (!entryText.trim()) {
      console.log("Error: Empty entry text");
      toast({
        title: "Error",
        description: "Please enter some text for your journal entry",
        variant: "destructive",
      });
      return;
    }

    if (!session?.user?.id) {
      console.log("Error: No user session found");
      toast({
        title: "Error",
        description: "You must be logged in to create a journal entry",
        variant: "destructive",
      });
      return;
    }

    if (entryText.length > MAX_CHARS) {
      console.log("Error: Entry exceeds maximum length");
      toast({
        title: "Error",
        description: `Entry exceeds maximum length of ${MAX_CHARS} characters`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Saving journal entry to database...");
      const { error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: session.user.id,
          entry_text: entryText,
          pillar: pillar.toLowerCase(),
        });

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log("Journal entry saved successfully");
      toast({
        title: "Success",
        description: "Journal entry saved successfully",
      });
      
      setEntryText("");
      onClose();
    } catch (error: any) {
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

  const charactersRemaining = MAX_CHARS - entryText.length;
  const isOverLimit = charactersRemaining < 0;

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent 
        className={`sm:max-w-[600px] animate-in fade-in-0 zoom-in-95 ${
          gradientClass ? `modal-glow-${gradientClass}` : ''
        }`}
        aria-labelledby="journal-modal-title"
      >
        <DialogHeader>
          <DialogTitle id="journal-modal-title">New Journal Entry - {pillar}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3" aria-label="Journal entry types">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="audio" disabled>Audio (Coming Soon)</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Audio journal entries will be available in a future update</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="video" disabled>Video (Coming Soon)</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Video journal entries will be available in a future update</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Write your thoughts..."
                className="min-h-[200px] transition-all focus-visible:ring-2"
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                maxLength={MAX_CHARS}
                aria-label="Journal entry text"
              />
              <div className={`text-sm mt-1 text-right ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                {charactersRemaining} characters remaining
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                aria-label="Cancel journal entry"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || isOverLimit || !entryText.trim()}
                aria-label="Save journal entry"
              >
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
