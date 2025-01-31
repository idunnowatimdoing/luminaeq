import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JournalHeader } from "@/components/journal/JournalHeader";
import { JournalEntryForm } from "@/components/journal/JournalEntryForm";
import { JournalEntryList } from "@/components/journal/JournalEntryList";

export const JournalPage = () => {
  const { pillar } = useParams();
  
  const formatPillarName = (pillar: string) => {
    return pillar
      ?.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || '';
  };

  // Fetch previous entries
  const { data: previousEntries, isLoading } = useQuery({
    queryKey: ['journal-entries', pillar],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('pillar', pillar)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-[#051527] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <JournalHeader pillarName={formatPillarName(pillar || '')} />

        {/* Two-page spread layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left page - Journal Entry Creation */}
          <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-gray-800">
            <JournalEntryForm initialPillar={pillar?.replace(/_/g, ' ') || ''} />
          </div>

          {/* Right page - Previous Entries */}
          <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Previous Entries</h2>
            <JournalEntryList entries={previousEntries} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};