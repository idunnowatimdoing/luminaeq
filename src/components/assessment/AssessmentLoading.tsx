import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LoadingMessage {
  content: string;
}

export const AssessmentLoading = () => {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    const fetchRandomMessage = async () => {
      try {
        console.log("Fetching random loading message");
        const { data, error } = await supabase
          .from('loading_messages')
          .select('content')
          .order('RANDOM()')
          .limit(1)
          .single();

        if (error) {
          console.error("Error fetching loading message:", error);
          return;
        }

        if (data) {
          console.log("Received loading message:", data.content);
          setMessage(data.content);
        }
      } catch (error) {
        console.error("Error in fetchRandomMessage:", error);
      }
    };

    fetchRandomMessage();
    // Fetch a new message every 5 seconds
    const interval = setInterval(fetchRandomMessage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#051527] flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Glowing Orb */}
        <div 
          className="w-32 h-32 mx-auto rounded-full relative"
          style={{
            background: "linear-gradient(-45deg, #00ffd5, #ffd700)",
            backgroundSize: "200% 200%",
            animation: "gradientFlow 3s ease infinite, pulse 2s ease-in-out infinite",
            boxShadow: "0 0 40px rgba(0, 255, 213, 0.6)"
          }}
        >
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(-45deg, rgba(0, 255, 213, 0.5), rgba(255, 215, 0, 0.5))",
              filter: "blur(20px)",
              animation: "pulse 2s ease-in-out infinite"
            }}
          />
        </div>

        {/* Loading Message */}
        <div className="relative z-10">
          <p className="text-white text-lg font-medium animate-fade-in">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};