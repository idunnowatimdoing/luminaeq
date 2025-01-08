import { Award, Mountain, GraduationCap } from "lucide-react";
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
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="bg-black/40 backdrop-blur-lg border-gray-800">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <h3 className="text-xl font-semibold text-white mb-4">{card.title}</h3>
              <div className="relative">
                <Icon 
                  size={32} 
                  className="text-[#00ffd5]"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(0, 255, 213, 0.5))"
                  }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};