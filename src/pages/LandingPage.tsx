import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Heart, Sparkles } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#051527]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-[#00ffd5] to-[#0077b6] text-transparent bg-clip-text">
            Lumina EQ
          </h1>
          <p className="text-2xl text-gray-300">
            Discover and develop your emotional intelligence with AI-powered insights
          </p>
          <div className="pt-8">
            <Button
              onClick={() => navigate("/auth")}
              className="bg-[#00ffd5] text-black hover:bg-[#00b4d8] transition-colors px-8 py-6 text-lg rounded-full"
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
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