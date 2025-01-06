import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface JournalEntryModalProps {
  trigger?: React.ReactNode;
  onEntrySubmitted?: () => void;
}

export function JournalEntryModal({ trigger, onEntrySubmitted }: JournalEntryModalProps) {
  const [open, setOpen] = useState(false);
  const [entryText, setEntryText] = useState("");
  const [pillar, setPillar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!entryText || !pillar) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: user.id,
          entry_text: entryText,
          pillar: pillar,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journal entry saved successfully",
      });

      setOpen(false);
      setEntryText("");
      setPillar("");
      onEntrySubmitted?.();
    } catch (error: any) {
      toast({
        title: "Error saving journal entry",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>New Journal Entry</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Journal Entry</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="pillar">EQ Pillar</Label>
            <Select value={pillar} onValueChange={setPillar}>
              <SelectTrigger>
                <SelectValue placeholder="Select a pillar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self_awareness">Self Awareness</SelectItem>
                <SelectItem value="self_regulation">Self Regulation</SelectItem>
                <SelectItem value="motivation">Motivation</SelectItem>
                <SelectItem value="empathy">Empathy</SelectItem>
                <SelectItem value="social_skills">Social Skills</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="entry">Journal Entry</Label>
            <Textarea
              id="entry"
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
              placeholder="Write your thoughts here..."
              className="h-32"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Saving..." : "Save Entry"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}