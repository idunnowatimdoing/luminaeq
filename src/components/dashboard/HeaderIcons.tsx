import { Menu, PlusCircle, History, Bell, Settings, X } from "lucide-react";
import { JournalEntryModal } from "@/components/journal/JournalEntryModal";
import { EntryHistory } from "@/components/dashboard/EntryHistory";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { Settings as SettingsPanel } from "@/components/dashboard/Settings";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export const HeaderIcons = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const IconContent = () => (
    <>
      <JournalEntryModal
        trigger={
          <PlusCircle 
            className="h-8 w-8 text-white hover:text-primary transition-colors cursor-pointer hover:scale-110 transform duration-200" 
          />
        }
      />

      <Dialog>
        <DialogTrigger>
          <History 
            className="h-6 w-6 text-white hover:text-primary transition-colors cursor-pointer hover:scale-110 transform duration-200" 
          />
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <EntryHistory />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger>
          <Bell 
            className="h-6 w-6 text-white hover:text-primary transition-colors cursor-pointer hover:scale-110 transform duration-200" 
          />
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <NotificationsPanel />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger>
          <Settings 
            className="h-6 w-6 text-white hover:text-primary transition-colors cursor-pointer hover:scale-110 transform duration-200" 
          />
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <SettingsPanel />
        </DialogContent>
      </Dialog>
    </>
  );

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-lumina-dark/80 backdrop-blur-lg border-t border-white/10">
        <div className="flex justify-around items-center h-16 px-4 max-w-lg mx-auto">
          <JournalEntryModal
            trigger={
              <PlusCircle className="h-7 w-7 text-white hover:text-primary transition-colors transform hover:scale-110 duration-200" />
            }
          />
          
          <Dialog>
            <DialogTrigger>
              <History className="h-6 w-6 text-white hover:text-primary transition-colors transform hover:scale-110 duration-200" />
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-y-auto">
              <EntryHistory />
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger>
              <Bell className="h-6 w-6 text-white hover:text-primary transition-colors transform hover:scale-110 duration-200" />
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-y-auto">
              <NotificationsPanel />
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger>
              <Settings className="h-6 w-6 text-white hover:text-primary transition-colors transform hover:scale-110 duration-200" />
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-y-auto">
              <SettingsPanel />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end items-center gap-4 pb-4">
      <IconContent />
    </div>
  );
};