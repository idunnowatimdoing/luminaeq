import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Insights = () => (
  <Card className="w-full bg-gray-800/50 backdrop-blur-lg border-gray-700">
    <CardHeader>
      <CardTitle className="text-xl text-white">EQ Insights</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 text-gray-300">
      <div className="flex items-center space-x-2">
        <div className="w-1 h-4 bg-green-500 rounded" />
        <p>Your self-awareness score has increased by 10 points!</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-1 h-4 bg-orange-500 rounded" />
        <p>You've maintained a 5-day journal entry streak. Great job!</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-1 h-4 bg-purple-500 rounded" />
        <p>Try active listening exercises to further improve your empathy score.</p>
      </div>
    </CardContent>
  </Card>
);