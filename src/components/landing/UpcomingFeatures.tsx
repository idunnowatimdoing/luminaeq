import { Card } from "@/components/ui/card";
import { Users, BookOpen } from "lucide-react";

export const UpcomingFeatures = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-2xl shadow-lg p-8 border border-white/20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Coming Soon to Lumina
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="backdrop-blur-md bg-black/40 p-8 border-lumina-teal/20 group hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <Users className="w-12 h-12 text-lumina-teal group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Lumina Connect</h3>
              <p className="text-white/90 mb-4">
                Share your journaling space with couples, teams, and groups up to 8 people. Foster deeper connections through shared emotional growth and understanding.
              </p>
              <ul className="text-white/80 space-y-2">
                <li>• Collaborative Journaling Spaces</li>
                <li>• Group EQ Analytics</li>
                <li>• Relationship Insights</li>
                <li>• Team Emotional Dynamics</li>
              </ul>
            </Card>

            <Card className="backdrop-blur-md bg-black/40 p-8 border-lumina-yellow/20 group hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <BookOpen className="w-12 h-12 text-lumina-yellow group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Community Journal</h3>
              <p className="text-white/90 mb-4">
                Join a vibrant community of emotional intelligence enthusiasts. Share experiences, learn from others, and grow together in a safe, supportive environment.
              </p>
              <ul className="text-white/80 space-y-2">
                <li>• Anonymous Sharing Options</li>
                <li>• Community Challenges</li>
                <li>• Peer Support Network</li>
                <li>• Guided Group Discussions</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};