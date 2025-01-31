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
          <Card key={card.title} className="bg-black/40 backdrop-blur-lg border-gray-800 relative overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="absolute top-4 right-4">
                <Toggle 
                  pressed={card.enabled}
                  onPressedChange={card.onToggle}
                  className="relative w-12 h-6 rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    background: card.enabled 
                      ? 'linear-gradient(to right, #00ffd5, #00b4d8)' 
                      : '#374151'
                  }}
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
                    style={{
                      transform: card.enabled ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </Toggle>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-4 mt-2">{card.title}</h3>
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