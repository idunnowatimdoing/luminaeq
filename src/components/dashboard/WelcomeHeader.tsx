import { JournalEntryModal } from "@/components/journal/JournalEntryModal";

interface WelcomeHeaderProps {
  userName?: string;
}

export const WelcomeHeader = ({ userName }: WelcomeHeaderProps) => (
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold text-white">
      Welcome back, {userName || 'User'}
    </h1>
    <div className="flex gap-4">
      <JournalEntryModal />
    </div>
  </div>
);