import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient orb in the background with reduced opacity */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-lumina-yellow/10 via-lumina-teal/10 to-lumina-blue/10 rounded-full blur-3xl opacity-20 animate-float" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
          The Journaling Experience{" "}
          <span className="block text-6xl md:text-8xl mt-2 bg-gradient-to-r from-lumina-yellow via-lumina-teal to-lumina-yellow bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Reimagined
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto">
          Master your emotions, improve relationships, and unlock your full potential with Lumina—your personalized EQ companion.
        </p>
        
        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
          Designed to grow with you, Lumina learns your emotional patterns and empowers your journey.
        </p>
        
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-lumina-blue hover:bg-lumina-blue/90 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Get Started
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              const featuresSection = document.querySelector("#features");
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="border-lumina-blue text-lumina-blue hover:bg-lumina-blue/10 px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-lg"
          >
            Explore Features
          </Button>
        </div>
      </div>
    </div>
  );
};