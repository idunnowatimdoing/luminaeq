import { History, Settings, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JournalEntryModal } from "@/components/journal/JournalEntryModal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EntryHistory } from "./EntryHistory";
import { Settings as SettingsPanel } from "./Settings";

interface DashboardHeaderProps {
  userName?: string;
}

export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-end gap-4 mb-8">
      <JournalEntryModal
        trigger={
          <Button size="lg" className="flex items-center gap-2">
            <PlusCircle className="w-6 h-6" />
            New Journal Entry
          </Button>
        }
      />
      
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 rounded-full hover:bg-white/10"
          >
            <History className="w-5 h-5" />
            <div className="absolute inset-0 animate-pulse rounded-full bg-white/5" />
          </Button>
        </DialogTrigger>
        <EntryHistory />
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 rounded-full hover:bg-white/10"
          >
            <Settings className="w-5 h-5" />
            <div className="absolute inset-0 animate-pulse rounded-full bg-white/5" />
          </Button>
        </DialogTrigger>
        <SettingsPanel />
      </Dialog>
    </div>
  );
};