import { Smile, Frown, Meh, Angry } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoodSelectorProps {
  value: string;
  onChange: (mood: string) => void;
}

const moods = [
  { icon: Smile, value: "happy", label: "Happy" },
  { icon: Meh, value: "neutral", label: "Neutral" },
  { icon: Frown, value: "sad", label: "Sad" },
  { icon: Angry, value: "angry", label: "Angry" },
];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex gap-4 justify-center">
      {moods.map((mood) => {
        const Icon = mood.icon;
        return (
          <button
            key={mood.value}
            onClick={() => onChange(mood.value)}
            className={cn(
              "p-2 rounded-full transition-all transform hover:scale-110",
              value === mood.value
                ? "bg-primary/20 text-primary scale-110"
                : "text-gray-400 hover:text-primary/80"
            )}
            type="button"
            title={mood.label}
          >
            <Icon className="w-8 h-8" />
          </button>
        );
      })}
    </div>
  );
}