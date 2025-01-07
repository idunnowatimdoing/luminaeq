import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Animated gradient orb in the background with reduced opacity */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-lumina-yellow/20 via-lumina-teal/20 to-lumina-blue/20 rounded-full blur-3xl opacity-10 animate-float" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-lumina-blue">
          The Journaling Experience{" "}
          <span className="block text-6xl md:text-8xl mt-2 bg-gradient-to-r from-lumina-yellow via-lumina-teal to-lumina-yellow bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Reimagined
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-lumina-dark mb-6 max-w-3xl mx-auto">
          Master your emotions, improve relationships, and unlock your full potential with Lumina—your personalized EQ companion.
        </p>
        
        <p className="text-lg text-lumina-neutral mb-12 max-w-2xl mx-auto">
          Designed to grow with you, Lumina learns your emotional patterns and empowers your journey.
        </p>
        
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="bg-lumina-blue hover:bg-lumina-blue/90 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Get Started
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              const featuresSection = document.querySelector("#features");
              featuresSection?.scrollIntoView({ behavior: "smooth" });
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