import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HotkeySettings {
  newEntry: string;
  viewHistory: string;
  viewInsights: string;
  viewSettings: string;
  viewChallenges: string;
}

export const useHotkeys = (openJournalModal?: () => void) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('hotkey_settings')
          .eq('user_id', user.id)
          .single();

        if (!profile?.hotkey_settings) return;

        const settings: HotkeySettings = profile.hotkey_settings;

        const isAltKey = event.altKey;
        const key = event.key.toUpperCase();

        if (isAltKey) {
          switch (key) {
            case settings.newEntry.split('+')[1].toUpperCase():
              if (openJournalModal) {
                event.preventDefault();
                openJournalModal();
              }
              break;
            case settings.viewHistory.split('+')[1].toUpperCase():
              event.preventDefault();
              navigate('/history');
              break;
            case settings.viewInsights.split('+')[1].toUpperCase():
              event.preventDefault();
              navigate('/insights');
              break;
            case settings.viewSettings.split('+')[1].toUpperCase():
              event.preventDefault();
              navigate('/settings');
              break;
            case settings.viewChallenges.split('+')[1].toUpperCase():
              event.preventDefault();
              navigate('/challenges');
              break;
          }
        }
      } catch (error) {
        console.error('Error handling hotkey:', error);
        toast.error('Error processing hotkey command');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, openJournalModal]);
};