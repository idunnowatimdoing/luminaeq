import { Menu, PlusCircle, History, Bell, Settings, X } from "lucide-react";
import { JournalEntryModal } from "@/components/journal/JournalEntryModal";
import { EntryHistory } from "@/components/dashboard/EntryHistory";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { Settings as SettingsPanel } from "@/components/dashboard/Settings";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const HeaderIcons = () => {
  const isMobile = useIsMobile();

  const DesktopHeader = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-lumina-dark/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white">Lumina</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Dialog>
              <DialogTrigger>
                <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  History
                </span>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <EntryHistory />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger>
                <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Notifications
                </span>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <NotificationsPanel />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger>
                <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Settings
                </span>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <SettingsPanel />
              </DialogContent>
            </Dialog>

            <JournalEntryModal
              trigger={
                <Button className="bg-lumina-blue hover:bg-lumina-blue/90">
                  New Entry
                </Button>
              }
            />
          </nav>
        </div>
      </div>
    </header>
  );

  const MobileBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-lumina-dark/80 backdrop-blur-lg border-t border-white/10">
      <div className="flex justify-around items-center h-16 px-4 max-w-lg mx-auto">
        <Dialog>
          <DialogTrigger>
            <History className="h-6 w-6 text-white hover:text-primary transition-colors transform hover:scale-110 duration-200" />
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-y-auto">
            <EntryHistory />
          </DialogContent>
        </Dialog>
        
        <JournalEntryModal
          trigger={
            <PlusCircle className="h-7 w-7 text-white hover:text-primary transition-colors transform hover:scale-110 duration-200" />
          }
        />
        
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

  return isMobile ? <MobileBottomNav /> : <DesktopHeader />;
};