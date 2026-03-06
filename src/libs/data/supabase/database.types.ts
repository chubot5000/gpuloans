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
    PostgrestVersion: "13.0.5"
  }
  usdai_loans: {
    Tables: {
      CalendlyMetadata: {
        Row: {
          created_at: string
          deal_id: string
          id: number
          metadata: Json | null
        }
        Insert: {
          created_at?: string
          deal_id: string
          id?: number
          metadata?: Json | null
        }
        Update: {
          created_at?: string
          deal_id?: string
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      LoanTerms: {
        Row: {
          borrower: string | null
          chain: number
          endTokenId: string | null
          erc20: string
          erc721: string
          exitFee: string
          expiration: number
          gracePeriodDuration: number
          gracePeriodRate: string
          id: string
          interestRateModel: string
          metadata: Json | null
          numberOfPayments: number
          originationFee: string
          repaymentInterval: number
          startTokenId: string | null
        }
        Insert: {
          borrower?: string | null
          chain: number
          endTokenId?: string | null
          erc20: string
          erc721: string
          exitFee: string
          expiration: number
          gracePeriodDuration: number
          gracePeriodRate: string
          id?: string
          interestRateModel: string
          metadata?: Json | null
          numberOfPayments: number
          originationFee: string
          repaymentInterval: number
          startTokenId?: string | null
        }
        Update: {
          borrower?: string | null
          chain?: number
          endTokenId?: string | null
          erc20?: string
          erc721?: string
          exitFee?: string
          expiration?: number
          gracePeriodDuration?: number
          gracePeriodRate?: string
          id?: string
          interestRateModel?: string
          metadata?: Json | null
          numberOfPayments?: number
          originationFee?: string
          repaymentInterval?: number
          startTokenId?: string | null
        }
        Relationships: []
      }
      NFTMetadata: {
        Row: {
          collection: string | null
          id: string
          metadata: Json
        }
        Insert: {
          collection?: string | null
          id: string
          metadata: Json
        }
        Update: {
          collection?: string | null
          id?: string
          metadata?: Json
        }
        Relationships: []
      }
      TrancheSpecs: {
        Row: {
          amount: string
          id: string
          lender: string
          loanTerms: string
          rate: string
          sortKey: number
        }
        Insert: {
          amount: string
          id?: string
          lender: string
          loanTerms: string
          rate: string
          sortKey: number
        }
        Update: {
          amount?: string
          id?: string
          lender?: string
          loanTerms?: string
          rate?: string
          sortKey?: number
        }
        Relationships: [
          {
            foreignKeyName: "tranchespecs_loanterms_fkey"
            columns: ["loanTerms"]
            isOneToOne: false
            referencedRelation: "LoanTerms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  usdai_loans: {
    Enums: {},
  },
} as const
