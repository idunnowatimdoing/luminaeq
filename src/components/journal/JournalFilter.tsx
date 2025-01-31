import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PillarSelect } from "./PillarSelect";
import { MoodSelector } from "./MoodSelector";

interface JournalFilterProps {
  onFilterChange: (filters: {
    startDate?: Date;
    endDate?: Date;
    pillar?: string;
    mood?: string;
  }) => void;
}

export function JournalFilter({ onFilterChange }: JournalFilterProps) {
  const [date, setDate] = useState<Date>();
  const [pillar, setPillar] = useState<string>("");
  const [mood, setMood] = useState<string>("");

  const handleFilterChange = () => {
    onFilterChange({
      startDate: date,
      pillar: pillar || undefined,
      mood: mood || undefined,
    });
  };

  const clearFilters = () => {
    setDate(undefined);
    setPillar("");
    setMood("");
    onFilterChange({});
  };

  return (
    <div className="space-y-4 p-4 bg-black/20 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Filter Entries</h3>
      
      <div className="grid gap-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-200">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-200">Pillar</label>
          <PillarSelect value={pillar} onValueChange={setPillar} />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-200">Mood</label>
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleFilterChange} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={clearFilters} variant="outline" className="flex-1">
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}