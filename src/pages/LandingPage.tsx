import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Heart, Sparkles } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient orb in the background */}
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-[#00ffd5]/20 via-[#00b4d8]/20 to-[#0077b6]/20 rounded-full blur-3xl opacity-10 animate-float" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#0077b6]">
            The Journaling Experience{" "}
            <span className="block text-6xl md:text-8xl mt-2 bg-gradient-to-r from-[#00ffd5] via-[#00b4d8] to-[#00ffd5] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Reimagined
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#051527] mb-6 max-w-3xl mx-auto">
            Master your emotions, improve relationships, and unlock your full potential with Lumina—your personalized EQ companion.
          </p>
          
          <p className="text-lg text-[#64748b] mb-12 max-w-2xl mx-auto">
            Designed to grow with you, Lumina learns your emotional patterns and empowers your journey.
          </p>
          
          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button 
              onClick={() => navigate("/auth")}
              size="lg" 
              className="bg-[#0077b6] hover:bg-[#0077b6]/90 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-[#0077b6] text-[#0077b6] hover:bg-[#0077b6]/10 px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Explore Features
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#0a1f35] p-8 rounded-xl border border-[#1e3951] space-y-4">
            <div className="w-12 h-12 bg-[#00ffd5]/10 rounded-full flex items-center justify-center">
              <Brain className="text-[#00ffd5]" />
            </div>
            <h3 className="text-xl font-semibold text-white">AI-Powered Journal</h3>
            <p className="text-gray-400">
              Transform your thoughts into emotional insights with our intelligent journaling system
            </p>
          </div>
          <div className="bg-[#0a1f35] p-8 rounded-xl border border-[#1e3951] space-y-4">
            <div className="w-12 h-12 bg-[#00ffd5]/10 rounded-full flex items-center justify-center">
              <Heart className="text-[#00ffd5]" />
            </div>
            <h3 className="text-xl font-semibold text-white">EQ Assessment</h3>
            <p className="text-gray-400">
              Get personalized insights into your emotional intelligence with our comprehensive assessment
            </p>
          </div>
          <div className="bg-[#0a1f35] p-8 rounded-xl border border-[#1e3951] space-y-4">
            <div className="w-12 h-12 bg-[#00ffd5]/10 rounded-full flex items-center justify-center">
              <Sparkles className="text-[#00ffd5]" />
            </div>
            <h3 className="text-xl font-semibold text-white">Growth Tracking</h3>
            <p className="text-gray-400">
              Monitor your emotional growth with detailed analytics and progress tracking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
