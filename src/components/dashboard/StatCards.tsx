import { Award, Mountain, GraduationCap, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const StatCards = () => {
  const cards = [
    {
      title: "Achievements",
      icon: Award,
    },
    {
      title: "Challenges",
      icon: Mountain,
    },
    {
      title: "Learning",
      icon: GraduationCap,
    },
    {
      title: "EQ Coach",
      icon: UserRound,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="bg-black/40 backdrop-blur-lg border-gray-800">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <h3 className="text-xl font-semibold text-white mb-4">{card.title}</h3>
              <Icon 
                size={48} 
                className="text-[#FFE5B4] animate-pulse"
                style={{
                  filter: "drop-shadow(0 0 12px rgba(255, 229, 180, 0.7))"
                }}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};