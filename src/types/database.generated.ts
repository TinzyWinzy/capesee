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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      audit_events: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: number
          metadata: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: never
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: never
          metadata?: Json
        }
        Relationships: []
      }
      booking_items: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          line_total: number | null
          product_id: string | null
          product_type: string
          quantity: number
          service_date: string | null
          title_snapshot: string
          unit_price: number
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          line_total?: number | null
          product_id?: string | null
          product_type: string
          quantity: number
          service_date?: string | null
          title_snapshot: string
          unit_price: number
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          line_total?: number | null
          product_id?: string | null
          product_type?: string
          quantity?: number
          service_date?: string | null
          title_snapshot?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          assigned_guide_id: string | null
          code: string
          created_at: string
          currency: string
          ends_at: string
          expires_at: string | null
          id: string
          idempotency_key: string | null
          payment_reference: string | null
          payment_status: string
          starts_at: string
          status: string
          total: number
          traveler_details: Json
          traveler_id: string
          updated_at: string
        }
        Insert: {
          assigned_guide_id?: string | null
          code: string
          created_at?: string
          currency?: string
          ends_at: string
          expires_at?: string | null
          id?: string
          idempotency_key?: string | null
          payment_reference?: string | null
          payment_status?: string
          starts_at: string
          status?: string
          total: number
          traveler_details?: Json
          traveler_id: string
          updated_at?: string
        }
        Update: {
          assigned_guide_id?: string | null
          code?: string
          created_at?: string
          currency?: string
          ends_at?: string
          expires_at?: string | null
          id?: string
          idempotency_key?: string | null
          payment_reference?: string | null
          payment_status?: string
          starts_at?: string
          status?: string
          total?: number
          traveler_details?: Json
          traveler_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      discoveries: {
        Row: {
          author_id: string
          category: string
          comments_count: number
          created_at: string
          description: string | null
          id: string
          latitude: number
          likes_count: number
          longitude: number
          photo_url: string | null
          place_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category: string
          comments_count?: number
          created_at?: string
          description?: string | null
          id?: string
          latitude: number
          likes_count?: number
          longitude: number
          photo_url?: string | null
          place_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          comments_count?: number
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number
          likes_count?: number
          longitude?: number
          photo_url?: string | null
          place_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discoveries_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_outbox: {
        Row: {
          attempts: number
          available_at: string
          booking_id: string | null
          channel: string
          created_at: string
          id: string
          last_error: string | null
          payload: Json
          recipient: string
          sent_at: string | null
          status: string
          template: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          attempts?: number
          available_at?: string
          booking_id?: string | null
          channel: string
          created_at?: string
          id?: string
          last_error?: string | null
          payload?: Json
          recipient: string
          sent_at?: string | null
          status?: string
          template: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          attempts?: number
          available_at?: string
          booking_id?: string | null
          channel?: string
          created_at?: string
          id?: string
          last_error?: string | null
          payload?: Json
          recipient?: string
          sent_at?: string | null
          status?: string
          template?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_outbox_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_attempts: {
        Row: {
          amount: number
          booking_id: string
          checkout_url: string | null
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          idempotency_key: string
          provider: string
          provider_payload: Json
          provider_reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id: string
          checkout_url?: string | null
          created_at?: string
          currency: string
          failure_reason?: string | null
          id?: string
          idempotency_key: string
          provider: string
          provider_payload?: Json
          provider_reference?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          checkout_url?: string | null
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          idempotency_key?: string
          provider?: string
          provider_payload?: Json
          provider_reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_attempts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      place_media: {
        Row: {
          alt_text: string | null
          created_at: string
          credit: string | null
          id: string
          kind: string
          place_id: string
          sort_order: number
          status: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          credit?: string | null
          id?: string
          kind: string
          place_id: string
          sort_order?: number
          status?: string
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          credit?: string | null
          id?: string
          kind?: string
          place_id?: string
          sort_order?: number
          status?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "place_media_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string
          id: string
          latitude: number
          location_name: string
          longitude: number
          name: string
          place_type: string
          rating: number
          region_id: string
          slug: string
          status: string
          summary: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description: string
          id?: string
          latitude: number
          location_name: string
          longitude: number
          name: string
          place_type: string
          rating?: number
          region_id: string
          slug: string
          status?: string
          summary: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string
          id?: string
          latitude?: number
          location_name?: string
          longitude?: number
          name?: string
          place_type?: string
          rating?: number
          region_id?: string
          slug?: string
          status?: string
          summary?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "places_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      product_slots: {
        Row: {
          capacity: number
          created_at: string
          ends_at: string
          id: string
          price_override: number | null
          product_id: string
          reserved: number
          starts_at: string
          status: string
          updated_at: string
        }
        Insert: {
          capacity: number
          created_at?: string
          ends_at: string
          id?: string
          price_override?: number | null
          product_id: string
          reserved?: number
          starts_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          ends_at?: string
          id?: string
          price_override?: number | null
          product_id?: string
          reserved?: number
          starts_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_slots_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          availability: Json
          cover_url: string | null
          created_at: string
          currency: string
          description: string
          duration_hours: number | null
          guide_included: boolean
          id: string
          pickup_included: boolean
          place_id: string | null
          price: number
          price_unit: string
          product_type: string
          provider_id: string | null
          rating: number
          region_id: string
          review_count: number
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          availability?: Json
          cover_url?: string | null
          created_at?: string
          currency?: string
          description: string
          duration_hours?: number | null
          guide_included?: boolean
          id?: string
          pickup_included?: boolean
          place_id?: string | null
          price: number
          price_unit: string
          product_type: string
          provider_id?: string | null
          rating?: number
          region_id: string
          review_count?: number
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          availability?: Json
          cover_url?: string | null
          created_at?: string
          currency?: string
          description?: string
          duration_hours?: number | null
          guide_included?: boolean
          id?: string
          pickup_included?: boolean
          place_id?: string | null
          price?: number
          price_unit?: string
          product_type?: string
          provider_id?: string | null
          rating?: number
          region_id?: string
          review_count?: number
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      regions: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_places: {
        Row: {
          created_at: string
          place_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          place_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          place_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_places_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          confidence: number | null
          created_at: string
          description: string
          event_kind: string
          event_year: number
          id: string
          place_id: string
          source_backed: boolean
          source_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          description: string
          event_kind?: string
          event_year: number
          id?: string
          place_id: string
          source_backed?: boolean
          source_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          description?: string
          event_kind?: string
          event_year?: number
          id?: string
          place_id?: string
          source_backed?: boolean
          source_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      past_experiences: {
        Row: {
          id: string
          provider_id: string | null
          place_id: string | null
          product_id: string | null
          title: string
          narrative: string
          occurred_at: string
          cover_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id?: string | null
          place_id?: string | null
          product_id?: string | null
          title: string
          narrative: string
          occurred_at: string
          cover_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string | null
          place_id?: string | null
          product_id?: string | null
          title?: string
          narrative?: string
          occurred_at?: string
          cover_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "past_experiences_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "past_experiences_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      past_experience_media: {
        Row: {
          id: string
          experience_id: string
          kind: string
          url: string
          alt_text: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          kind: string
          url: string
          alt_text?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          kind?: string
          url?: string
          alt_text?: string | null
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "past_experience_media_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "past_experiences"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_notification_batch: {
        Args: { p_limit?: number }
        Returns: {
          attempts: number
          available_at: string
          booking_id: string | null
          channel: string
          created_at: string
          id: string
          last_error: string | null
          payload: Json
          recipient: string
          sent_at: string | null
          status: string
          template: string
          updated_at: string
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "notification_outbox"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      complete_notification: {
        Args: { p_error?: string; p_id: string; p_sent: boolean }
        Returns: undefined
      }
      create_booking: {
        Args: {
          p_idempotency_key: string
          p_items: Json
          p_traveler_details: Json
        }
        Returns: Json
      }
      moderate_discovery: {
        Args: { p_decision: string; p_discovery_id: string; p_note?: string }
        Returns: {
          author_id: string
          category: string
          comments_count: number
          created_at: string
          description: string | null
          id: string
          latitude: number
          likes_count: number
          longitude: number
          photo_url: string | null
          place_id: string | null
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "discoveries"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      process_paynow_update: {
        Args: {
          p_amount: number
          p_payload: Json
          p_provider_reference: string
          p_reference: string
          p_status: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

