import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { JournalEntryModalHeader } from "./JournalEntryModalHeader";
import { JournalEntryModalForm } from "./JournalEntryModalForm";

interface JournalEntryModalProps {
  trigger?: React.ReactNode;
  onEntrySubmitted?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function JournalEntryModal({ 
  trigger, 
  onEntrySubmitted,
  isOpen,
  onOpenChange 
}: JournalEntryModalProps) {
  const [localOpen, setLocalOpen] = useState(false);

  // Use either controlled or uncontrolled open state
  const open = isOpen !== undefined ? isOpen : localOpen;
  const setOpen = onOpenChange || setLocalOpen;

  const handleSuccess = () => {
    onEntrySubmitted?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>New Journal Entry</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <JournalEntryModalHeader />
        <JournalEntryModalForm 
          onSuccess={handleSuccess}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}