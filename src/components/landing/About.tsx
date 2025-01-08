import { Card } from "@/components/ui/card";
import { TrendingUp, Brain } from "lucide-react";

export const About = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-2xl shadow-lg p-8 border border-white/20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white relative">
            What Is Emotional Intelligence?
            <div className="absolute -right-4 top-0 w-8 h-8 bg-gradient-to-r from-lumina-yellow to-lumina-teal rounded-full blur-sm opacity-50" />
          </h2>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              Emotional Intelligence (EQ) is your ability to understand, manage, and grow your emotions while connecting with others on a deeper level. It's a skill that empowers you to thrive in both personal and professional relationships, navigate challenges with resilience, and unlock your full potential.
            </p>
            <p className="text-lg text-white/80 mb-8">
              Studies show people with high EQ earn 29% more annually and report higher job satisfaction.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card className="backdrop-blur-md bg-black/40 p-6 border-lumina-teal/20 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-lumina-teal group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Better Performance</h3>
                <p className="text-white/80">90% of top performers have high EQ</p>
              </Card>
              <Card className="backdrop-blur-md bg-black/40 p-6 border-lumina-yellow/20 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-lumina-yellow group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Growth Potential</h3>
                <p className="text-white/80">Unlike IQ, your EQ can be strengthened over time</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};