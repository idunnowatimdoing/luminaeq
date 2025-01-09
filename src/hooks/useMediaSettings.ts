import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MediaSettings {
  mediaStorageEnabled: boolean;
  transcriptionOnDeletion: boolean;
  mediaRetentionDays: number;
  mediaStorageQuota: number;
}

export const useMediaSettings = () => {
  const [settings, setSettings] = useState<MediaSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No authenticated user');

        const { data, error } = await supabase
          .from('profiles')
          .select('media_storage_enabled, transcription_on_deletion, media_retention_days, media_storage_quota')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        setSettings({
          mediaStorageEnabled: data.media_storage_enabled,
          transcriptionOnDeletion: data.transcription_on_deletion,
          mediaRetentionDays: data.media_retention_days,
          mediaStorageQuota: data.media_storage_quota,
        });
      } catch (err: any) {
        console.error('Error fetching media settings:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};