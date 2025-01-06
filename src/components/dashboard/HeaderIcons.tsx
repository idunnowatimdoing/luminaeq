import { PlusCircle, History, Bell, Settings } from "lucide-react";
import { JournalEntryModal } from "@/components/journal/JournalEntryModal";
import { EntryHistory } from "@/components/dashboard/EntryHistory";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { Settings as SettingsPanel } from "@/components/dashboard/Settings";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const HeaderIcons = () => {
  return (
    <div className="flex justify-end items-center gap-4 pb-4">
      {/* Journal Entry Modal */}
      <JournalEntryModal
        trigger={
          <PlusCircle 
            className="h-10 w-10 text-white hover:text-primary transition-colors cursor-pointer hover:scale-110 transform duration-200" 
          />
        }
      />

      {/* History Modal */}
      <Dialog>
        <DialogTrigger>
          <History 
            className="h-7 w-7 text-white hover:text-primary transition-colors cursor-pointer hover:scale-110 transform duration-200" 
          />
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <EntryHistory />
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog>
        <DialogTrigger>
          <Bell 
            className="h-7 w-7 text-white hover:text-primary transition-colors cursor-pointer hover:scale-110 transform duration-200" 
          />
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <NotificationsPanel />
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog>
        <DialogTrigger>
          <Settings 
            className="h-7 w-7 text-white hover:text-primary transition-colors cursor-pointer hover:scale-110 transform duration-200" 
          />
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <SettingsPanel />
        </DialogContent>
      </Dialog>
    </div>
  );
};