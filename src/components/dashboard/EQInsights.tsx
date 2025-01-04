import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EQInsights = () => {
  const insights = [
    { color: "bg-green-500", text: "Your self-awareness score has increased by 2 points!" },
    { color: "bg-orange-500", text: "You've maintained a 5-day journal entry streak. Great job!" },
    { color: "bg-purple-500", text: "Try active listening exercises to further improve your empathy score." }
  ];

  return (
    <Card className="w-full bg-glass rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl text-white">EQ Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm sm:text-base text-gray-300">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className={`w-1 h-4 ${insight.color} rounded`} />
            <p>{insight.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};