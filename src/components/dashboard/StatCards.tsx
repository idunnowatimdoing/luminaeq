import { Mountain, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

export const StatCards = () => {
  const [challengesEnabled, setChallengesEnabled] = useState(true);
  const [coachEnabled, setCoachEnabled] = useState(true);

  const cards = [
    {
      title: "Challenges",
      icon: Mountain,
      enabled: challengesEnabled,
      onToggle: () => setChallengesEnabled(prev => !prev)
    },
    {
      title: "EQ Coach",
      icon: UserRound,
      enabled: coachEnabled,
      onToggle: () => setCoachEnabled(prev => !prev)
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="bg-black/40 backdrop-blur-lg border-gray-800">
            <CardContent className="flex flex-col items-center justify-center p-6 relative">
              <Toggle 
                pressed={card.enabled}
                onPressedChange={card.onToggle}
                className={`absolute top-2 right-2 w-14 h-7 rounded-full transition-colors duration-200 ease-in-out
                  ${card.enabled 
                    ? 'bg-gradient-to-r from-lumina-yellow to-lumina-teal border-none' 
                    : 'bg-gray-600'
                  }`}
              >
                <div 
                  className={`absolute w-6 h-6 rounded-full transition-transform duration-200 ease-in-out
                    ${card.enabled 
                      ? 'translate-x-7 bg-white' 
                      : 'translate-x-0.5 bg-gray-300'
                    }
                  `}
                />
              </Toggle>
              <h3 className="text-xl font-semibold text-white mb-4">{card.title}</h3>
              <Icon 
                size={48} 
                className={`${card.enabled ? 'text-[#FFE5B4] animate-pulse' : 'text-gray-500'}`}
                style={{
                  filter: card.enabled ? "drop-shadow(0 0 12px rgba(255, 229, 180, 0.7))" : "none"
                }}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};