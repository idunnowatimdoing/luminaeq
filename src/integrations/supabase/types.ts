export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assessment_responses: {
        Row: {
          created_at: string | null
          id: string
          pillar: string
          question_id: number
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          pillar: string
          question_id: number
          score: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          pillar?: string
          question_id?: number
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      benefits_tips: {
        Row: {
          created_at: string | null
          description: string
          id: string
          pillar_tags: string[]
          popularity_score: number | null
          skill_level: Database["public"]["Enums"]["skill_level"]
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          pillar_tags: string[]
          popularity_score?: number | null
          skill_level: Database["public"]["Enums"]["skill_level"]
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          pillar_tags?: string[]
          popularity_score?: number | null
          skill_level?: Database["public"]["Enums"]["skill_level"]
          title?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          created_at: string | null
          description: string
          id: number
          pillar: string
          points: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: number
          pillar: string
          points?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: number
          pillar?: string
          points?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      dashboard_insights: {
        Row: {
          current_eq_score: number | null
          emotional_trends: Json | null
          empathy_goal: number | null
          goal_eq_score: number | null
          id: string
          motivation_goal: number | null
          self_awareness_goal: number | null
          self_regulation_goal: number | null
          social_skills_goal: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          current_eq_score?: number | null
          emotional_trends?: Json | null
          empathy_goal?: number | null
          goal_eq_score?: number | null
          id?: string
          motivation_goal?: number | null
          self_awareness_goal?: number | null
          self_regulation_goal?: number | null
          social_skills_goal?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          current_eq_score?: number | null
          emotional_trends?: Json | null
          empathy_goal?: number | null
          goal_eq_score?: number | null
          id?: string
          motivation_goal?: number | null
          self_awareness_goal?: number | null
          self_regulation_goal?: number | null
          social_skills_goal?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          created_at: string | null
          entry_audio: string | null
          entry_text: string | null
          id: string
          mood: string | null
          pillar: string | null
          sentiment_data: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entry_audio?: string | null
          entry_text?: string | null
          id?: string
          mood?: string | null
          pillar?: string | null
          sentiment_data?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entry_audio?: string | null
          entry_text?: string | null
          id?: string
          mood?: string | null
          pillar?: string | null
          sentiment_data?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      loading_messages: {
        Row: {
          content: string
          created_at: string | null
          id: number
          message_type: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          message_type: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          message_type?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          title: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          title: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_range: string | null
          avatar_url: string | null
          billing_cycle: string | null
          created_at: string | null
          empathy: number | null
          id: string
          in_app_notifications: boolean | null
          journaling_prompts: boolean | null
          language: string | null
          last_payment_method: Json | null
          leaderboard_opt_out: boolean | null
          motivation: number | null
          name: string | null
          onboarding_completed: boolean | null
          push_notifications: boolean | null
          self_awareness: number | null
          self_regulation: number | null
          settings: Json | null
          social_skills: number | null
          storage_preference: string | null
          subscription_plan: string | null
          subscription_status: string | null
          subscription_tier: string | null
          theme: string | null
          total_eq_score: number | null
          user_id: string
        }
        Insert: {
          age_range?: string | null
          avatar_url?: string | null
          billing_cycle?: string | null
          created_at?: string | null
          empathy?: number | null
          id?: string
          in_app_notifications?: boolean | null
          journaling_prompts?: boolean | null
          language?: string | null
          last_payment_method?: Json | null
          leaderboard_opt_out?: boolean | null
          motivation?: number | null
          name?: string | null
          onboarding_completed?: boolean | null
          push_notifications?: boolean | null
          self_awareness?: number | null
          self_regulation?: number | null
          settings?: Json | null
          social_skills?: number | null
          storage_preference?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          theme?: string | null
          total_eq_score?: number | null
          user_id: string
        }
        Update: {
          age_range?: string | null
          avatar_url?: string | null
          billing_cycle?: string | null
          created_at?: string | null
          empathy?: number | null
          id?: string
          in_app_notifications?: boolean | null
          journaling_prompts?: boolean | null
          language?: string | null
          last_payment_method?: Json | null
          leaderboard_opt_out?: boolean | null
          motivation?: number | null
          name?: string | null
          onboarding_completed?: boolean | null
          push_notifications?: boolean | null
          self_awareness?: number | null
          self_regulation?: number | null
          settings?: Json | null
          social_skills?: number | null
          storage_preference?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          theme?: string | null
          total_eq_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      social_connections: {
        Row: {
          connected_at: string | null
          connection_status: boolean | null
          id: string
          platform: string
          user_id: string | null
        }
        Insert: {
          connected_at?: string | null
          connection_status?: boolean | null
          id?: string
          platform: string
          user_id?: string | null
        }
        Update: {
          connected_at?: string | null
          connection_status?: boolean | null
          id?: string
          platform?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          challenge_id: number
          challenge_name: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          goal: number | null
          id: number
          pillar: string | null
          points: number | null
          progress: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          challenge_id: number
          challenge_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          goal?: number | null
          id?: number
          pillar?: string | null
          points?: number | null
          progress?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: number
          challenge_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          goal?: number | null
          id?: number
          pillar?: string | null
          points?: number | null
          progress?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tip_interactions: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          is_completed: boolean | null
          tip_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          is_completed?: boolean | null
          tip_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          is_completed?: boolean | null
          tip_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tip_interactions_tip_id_fkey"
            columns: ["tip_id"]
            isOneToOne: false
            referencedRelation: "benefits_tips"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          password: string
          settings: Json | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          password: string
          settings?: Json | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          password?: string
          settings?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      mock_auth_uid: {
        Args: {
          uid: string
        }
        Returns: string
      }
    }
    Enums: {
      skill_level: "beginner" | "intermediate" | "advanced" | "proficient"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
