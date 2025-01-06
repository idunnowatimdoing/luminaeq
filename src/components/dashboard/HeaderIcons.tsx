import { Menu, PlusCircle, History, Bell, Settings } from "lucide-react";
import { JournalEntryModal } from "@/components/journal/JournalEntryModal";
import { EntryHistory } from "@/components/dashboard/EntryHistory";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { Settings as SettingsPanel } from "@/components/dashboard/Settings";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

export const HeaderIcons = () => {
  const isMobile = useIsMobile();

  const IconContent = () => (
    <>
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
    </>
  );

  if (isMobile) {
    return (
      <div className="flex justify-end items-center pb-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2">
            <Menu className="h-8 w-8 text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800/95 backdrop-blur-lg border-gray-700 mt-2">
            <DropdownMenuItem className="flex justify-center focus:bg-gray-700/50">
              <JournalEntryModal
                trigger={
                  <PlusCircle className="h-8 w-8 text-white" />
                }
              />
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-center focus:bg-gray-700/50">
              <Dialog>
                <DialogTrigger>
                  <History className="h-6 w-6 text-white" />
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-y-auto">
                  <EntryHistory />
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-center focus:bg-gray-700/50">
              <Dialog>
                <DialogTrigger>
                  <Bell className="h-6 w-6 text-white" />
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-y-auto">
                  <NotificationsPanel />
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-center focus:bg-gray-700/50">
              <Dialog>
                <DialogTrigger>
                  <Settings className="h-6 w-6 text-white" />
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-y-auto">
                  <SettingsPanel />
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex justify-end items-center gap-4 pb-4">
      <IconContent />
    </div>
  );
};