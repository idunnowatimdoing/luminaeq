import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface DashboardData {
  current_eq_score: number;
  self_awareness: number;
  self_regulation: number;
  motivation: number;
  empathy: number;
  social_skills: number;
  name?: string | null;  // Updated type to allow null
}

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      console.log("Fetching dashboard data...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      console.log("Fetching profile data for user:", user.id);
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("total_eq_score, self_awareness, self_regulation, motivation, empathy, social_skills, name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      
      console.log("Profile data received:", profileData);
      if (!profileData) {
        console.log("No profile data found");
        return;
      }

      setDashboardData({
        current_eq_score: profileData.total_eq_score || 0,
        self_awareness: profileData.self_awareness || 0,
        self_regulation: profileData.self_regulation || 0,
        motivation: profileData.motivation || 0,
        empathy: profileData.empathy || 0,
        social_skills: profileData.social_skills || 0,
        name: profileData.name,
      });
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error fetching dashboard data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Setting up realtime subscription for user:", user.id);
      const channel = supabase
        .channel('profiles_updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log("Received profile update:", payload);
            setDashboardData({
              current_eq_score: payload.new.total_eq_score || 0,
              self_awareness: payload.new.self_awareness || 0,
              self_regulation: payload.new.self_regulation || 0,
              motivation: payload.new.motivation || 0,
              empathy: payload.new.empathy || 0,
              social_skills: payload.new.social_skills || 0,
              name: payload.new.name,
            });
          }
        )
        .subscribe();

      return () => {
        console.log("Cleaning up realtime subscription");
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error("Error setting up realtime subscription:", error);
    }
  };

  return { dashboardData, loading };
};