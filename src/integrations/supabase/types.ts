export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          path: string | null
          properties: Json
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          path?: string | null
          properties?: Json
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          path?: string | null
          properties?: Json
          user_agent?: string | null
        }
        Relationships: []
      }
      briefings: {
        Row: {
          content: string
          created_at: string
          emailed_at: string | null
          id: string
          stats: Json
          user_id: string
          week_start: string
        }
        Insert: {
          content: string
          created_at?: string
          emailed_at?: string | null
          id?: string
          stats?: Json
          user_id: string
          week_start: string
        }
        Update: {
          content?: string
          created_at?: string
          emailed_at?: string | null
          id?: string
          stats?: Json
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      content_attachments: {
        Row: {
          content_item_id: string
          created_at: string
          file_name: string
          file_size_bytes: number | null
          id: string
          mime_type: string | null
          sort_order: number
          storage_path: string
        }
        Insert: {
          content_item_id: string
          created_at?: string
          file_name: string
          file_size_bytes?: number | null
          id?: string
          mime_type?: string | null
          sort_order?: number
          storage_path: string
        }
        Update: {
          content_item_id?: string
          created_at?: string
          file_name?: string
          file_size_bytes?: number | null
          id?: string
          mime_type?: string | null
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_attachments_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          caption: string | null
          content_type: string
          created_at: string
          external_url: string | null
          hashtags: string[]
          hook: string | null
          id: string
          notes: string | null
          performance_stats: Json
          pillar: string | null
          platform: string
          posted_at: string | null
          project_id: string | null
          scheduled_at: string | null
          status: string
          tags: string[]
          title: string
          updated_at: string
          user_id: string
          venture_id: string | null
        }
        Insert: {
          caption?: string | null
          content_type: string
          created_at?: string
          external_url?: string | null
          hashtags?: string[]
          hook?: string | null
          id?: string
          notes?: string | null
          performance_stats?: Json
          pillar?: string | null
          platform: string
          posted_at?: string | null
          project_id?: string | null
          scheduled_at?: string | null
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
          user_id: string
          venture_id?: string | null
        }
        Update: {
          caption?: string | null
          content_type?: string
          created_at?: string
          external_url?: string | null
          hashtags?: string[]
          hook?: string | null
          id?: string
          notes?: string | null
          performance_stats?: Json
          pillar?: string | null
          platform?: string
          posted_at?: string | null
          project_id?: string | null
          scheduled_at?: string | null
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      content_pillars: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort_order?: number
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
          user_id?: string
        }
        Relationships: []
      }
      daily_logs: {
        Row: {
          challenges: string | null
          created_at: string
          energy: number | null
          id: string
          log_date: string
          mood: number | null
          notes: string | null
          tags: string[]
          tomorrow_focus: string | null
          updated_at: string
          user_id: string
          wins: string | null
        }
        Insert: {
          challenges?: string | null
          created_at?: string
          energy?: number | null
          id?: string
          log_date: string
          mood?: number | null
          notes?: string | null
          tags?: string[]
          tomorrow_focus?: string | null
          updated_at?: string
          user_id: string
          wins?: string | null
        }
        Update: {
          challenges?: string | null
          created_at?: string
          energy?: number | null
          id?: string
          log_date?: string
          mood?: number | null
          notes?: string | null
          tags?: string[]
          tomorrow_focus?: string | null
          updated_at?: string
          user_id?: string
          wins?: string | null
        }
        Relationships: []
      }
      daily_logs_quick: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          converted_project_id: string | null
          created_at: string
          email: string
          form_data: Json
          id: string
          name: string
          notes: string | null
          phone: string | null
          service_type: string
          status: string
        }
        Insert: {
          converted_project_id?: string | null
          created_at?: string
          email: string
          form_data?: Json
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          service_type: string
          status?: string
        }
        Update: {
          converted_project_id?: string | null
          created_at?: string
          email?: string
          form_data?: Json
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          service_type?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_converted_project_id_fkey"
            columns: ["converted_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      intros: {
        Row: {
          context: string | null
          created_at: string
          follow_up_at: string | null
          from_person_id: string | null
          id: string
          note: string | null
          outcome: string | null
          status: string
          to_person_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          follow_up_at?: string | null
          from_person_id?: string | null
          id?: string
          note?: string | null
          outcome?: string | null
          status?: string
          to_person_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: string | null
          created_at?: string
          follow_up_at?: string | null
          from_person_id?: string | null
          id?: string
          note?: string | null
          outcome?: string | null
          status?: string
          to_person_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "intros_from_person_id_fkey"
            columns: ["from_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intros_to_person_id_fkey"
            columns: ["to_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_entries: {
        Row: {
          created_at: string
          entry_date: string
          id: string
          kpi_id: string
          note: string | null
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          entry_date: string
          id?: string
          kpi_id: string
          note?: string | null
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          entry_date?: string
          id?: string
          kpi_id?: string
          note?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_entries_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          archived: boolean
          created_at: string
          currency_code: string | null
          custom_unit_label: string | null
          description: string | null
          direction: string
          entry_cadence: string
          id: string
          meta: Json
          name: string
          sort_order: number
          target_value: number | null
          unit: string
          updated_at: string
          user_id: string
          venture_id: string | null
        }
        Insert: {
          archived?: boolean
          created_at?: string
          currency_code?: string | null
          custom_unit_label?: string | null
          description?: string | null
          direction?: string
          entry_cadence?: string
          id?: string
          meta?: Json
          name: string
          sort_order?: number
          target_value?: number | null
          unit: string
          updated_at?: string
          user_id: string
          venture_id?: string | null
        }
        Update: {
          archived?: boolean
          created_at?: string
          currency_code?: string | null
          custom_unit_label?: string | null
          description?: string | null
          direction?: string
          entry_cadence?: string
          id?: string
          meta?: Json
          name?: string
          sort_order?: number
          target_value?: number | null
          unit?: string
          updated_at?: string
          user_id?: string
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpis_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          city: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          last_contacted_at: string | null
          meta: Json
          name: string
          notes: string | null
          phone: string | null
          relationship_strength: number | null
          role: string | null
          source: string | null
          tags: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contacted_at?: string | null
          meta?: Json
          name: string
          notes?: string | null
          phone?: string | null
          relationship_strength?: number | null
          role?: string | null
          source?: string | null
          tags?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contacted_at?: string | null
          meta?: Json
          name?: string
          notes?: string | null
          phone?: string | null
          relationship_strength?: number | null
          role?: string | null
          source?: string | null
          tags?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      priorities_today: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          priority_date: string
          slot: number
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          priority_date: string
          slot: number
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          priority_date?: string
          slot?: number
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          meta: Json
          percent_complete: number
          priority: string
          sort_order: number
          source_id: string | null
          source_type: string | null
          status: string
          tags: string[]
          title: string
          updated_at: string
          user_id: string
          venture_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          meta?: Json
          percent_complete?: number
          priority?: string
          sort_order?: number
          source_id?: string | null
          source_type?: string | null
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
          user_id: string
          venture_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          meta?: Json
          percent_complete?: number
          priority?: string
          sort_order?: number
          source_id?: string | null
          source_type?: string | null
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_captures: {
        Row: {
          archived: boolean
          body: string
          created_at: string
          id: string
          kind: string
          meta: Json
          pinned: boolean
          promoted_at: string | null
          promoted_project_id: string | null
          tags: string[]
          title: string | null
          updated_at: string
          user_id: string
          venture_id: string | null
        }
        Insert: {
          archived?: boolean
          body: string
          created_at?: string
          id?: string
          kind?: string
          meta?: Json
          pinned?: boolean
          promoted_at?: string | null
          promoted_project_id?: string | null
          tags?: string[]
          title?: string | null
          updated_at?: string
          user_id: string
          venture_id?: string | null
        }
        Update: {
          archived?: boolean
          body?: string
          created_at?: string
          id?: string
          kind?: string
          meta?: Json
          pinned?: boolean
          promoted_at?: string | null
          promoted_project_id?: string | null
          tags?: string[]
          title?: string | null
          updated_at?: string
          user_id?: string
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_captures_promoted_project_id_fkey"
            columns: ["promoted_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quick_captures_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      subtasks: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          project_id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          project_id: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          project_id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      ventures: {
        Row: {
          accent_color: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          meta: Json
          name: string
          short_name: string | null
          slug: string
          sort_order: number
          status: string
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          accent_color?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          meta?: Json
          name: string
          short_name?: string | null
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          accent_color?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          meta?: Json
          name?: string
          short_name?: string | null
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analytics_over_time: {
        Args: { p_bucket?: string; p_from: string; p_to: string }
        Returns: {
          bucket_start: string
          count: number
          event_name: string
        }[]
      }
      analytics_overview: {
        Args: { p_from: string; p_to: string }
        Returns: {
          chat_engagements: number
          inquiries: number
          page_views: number
          unique_sessions: number
        }[]
      }
      analytics_top_events: {
        Args: { p_from: string; p_limit?: number; p_to: string }
        Returns: {
          count: number
          event_name: string
          latest: string
        }[]
      }
      analytics_top_paths: {
        Args: { p_from: string; p_limit?: number; p_to: string }
        Returns: {
          inquiries: number
          last_visited: string
          page_views: number
          path: string
        }[]
      }
      analytics_top_sources: {
        Args: { p_from: string; p_limit?: number; p_to: string }
        Returns: {
          inquiries: number
          sessions: number
          source: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      kpi_summary: {
        Args: { p_kpi_id: string; p_range_days: number }
        Returns: {
          current_value: number
          entry_count: number
          latest_entry_date: string
          prior_value: number
        }[]
      }
      seed_default_ventures: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
