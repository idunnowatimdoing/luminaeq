import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JournalHeader } from "@/components/journal/JournalHeader";
import { JournalEntryForm } from "@/components/journal/JournalEntryForm";
import { JournalEntryList } from "@/components/journal/JournalEntryList";
import { JournalFilter } from "@/components/journal/JournalFilter";
import { useState } from "react";

interface Filters {
  startDate?: Date;
  endDate?: Date;
  pillar?: string;
  mood?: string;
}

export const JournalPage = () => {
  const { pillar } = useParams();
  const [filters, setFilters] = useState<Filters>({});
  
  const formatPillarName = (pillar: string) => {
    return pillar
      ?.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || '';
  };

  // Fetch previous entries with filters
  const { data: previousEntries, isLoading } = useQuery({
    queryKey: ['journal-entries', pillar, filters],
    queryFn: async () => {
      let query = supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (pillar) {
        query = query.eq('pillar', pillar);
      }
      
      if (filters.pillar) {
        query = query.eq('pillar', filters.pillar);
      }

      if (filters.mood) {
        query = query.eq('mood', filters.mood);
      }

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-[#051527] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <JournalHeader pillarName={formatPillarName(pillar || '')} />

        {/* Three-column layout */}
        <div className="grid md:grid-cols-[250px_1fr_1fr] gap-8">
          {/* Left sidebar - Filters */}
          <div>
            <JournalFilter onFilterChange={setFilters} />
          </div>

          {/* Middle - Journal Entry Creation */}
          <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-gray-800">
            <JournalEntryForm initialPillar={pillar?.replace(/_/g, ' ') || ''} />
          </div>

          {/* Right - Previous Entries */}
          <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Previous Entries</h2>
            <JournalEntryList entries={previousEntries} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};