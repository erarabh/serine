export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string // example: 'e3c7d670-71c8-4e95-96cf-92c241923b0b'
          user_id: string // example: 'c3fcd9ae-c943-47ff-9b10-ad37006de704'
          name: string // example: 'AI Agent 1'
          created_at: string | null // example: '2025-06-18T16:07:43.206912'
          total_conversations: number | null
          resolved_queries: number | null
          satisfaction_score: number | null
          support_hotline: string | null // example: '+213555000222'
        }
        Insert: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string | null
          total_conversations?: number | null
          resolved_queries?: number | null
          satisfaction_score?: number | null
          support_hotline?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string | null
          total_conversations?: number | null
          resolved_queries?: number | null
          satisfaction_score?: number | null
          support_hotline?: string | null
        }
      }
      chat_metrics: {
        Row: {
          id: string
          user_id: string
          agent_id: string
          date: string
          total_messages: number
          user_messages: number
          bot_messages: number
          positive: number
          neutral: number
          negative: number
          satisfaction_score: number
          avg_response_time_ms: number
        }
        Insert: {
          id?: string
          user_id?: string
          agent_id?: string
          date?: string
          total_messages?: number
          user_messages?: number
          bot_messages?: number
          positive?: number
          neutral?: number
          negative?: number
          satisfaction_score?: number
          avg_response_time_ms?: number
        }
        Update: {
          id?: string
          user_id?: string
          agent_id?: string
          date?: string
          total_messages?: number
          user_messages?: number
          bot_messages?: number
          positive?: number
          neutral?: number
          negative?: number
          satisfaction_score?: number
          avg_response_time_ms?: number
        }
      }
      chat_sentiments: {
        Row: {
          id: string
          user_id: string
          agent_id: string
          message: string
          sentiment_score: number
          sentiment_label: string
          positive_words: Json
          negative_words: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          agent_id?: string
          message?: string
          sentiment_score?: number
          sentiment_label?: string
          positive_words?: Json
          negative_words?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_id?: string
          message?: string
          sentiment_score?: number
          sentiment_label?: string
          positive_words?: Json
          negative_words?: Json
          created_at?: string
        }
      }
      qa_pairs: {
        Row: {
          id: string
          user_id: string
          question: string
          answer: string
          created_at: string
          embedding: Json
          agent_id: string
          source_url: string
        }
        Insert: {
          id?: string
          user_id?: string
          question?: string
          answer?: string
          created_at?: string
          embedding?: Json
          agent_id?: string
          source_url?: string
        }
        Update: {
          id?: string
          user_id?: string
          question?: string
          answer?: string
          created_at?: string
          embedding?: Json
          agent_id?: string
          source_url?: string
        }
      }
      scrapes: {
        Row: {
          id: string
          user_id: string
          url: string
          content: string | null
        }
        Insert: {
          id?: string
          user_id?: string
          url?: string
          content?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          content?: string | null
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          agent_id: string
          role: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          agent_id?: string
          role?: string
          message?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_id?: string
          role?: string
          message?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          subscription_id: string // example: 'sub-test-001'
          variant_id: number // example: 892509
          status: string // example: 'active'
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          subscription_id?: string
          variant_id?: number
          status?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string
          variant_id?: number
          status?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string // example: 'rabhirabah2015@gmail.com'
          plan: string // example: 'pro'
          created_at: string
          plan_period: string
          plan_started_at: string
          plan_ends_at: string
          name: string
        }
        Insert: {
          id?: string
          email?: string
          plan?: string
          created_at?: string
          plan_period?: string
          plan_started_at?: string
          plan_ends_at?: string
          name?: string
        }
        Update: {
          id?: string
          email?: string
          plan?: string
          created_at?: string
          plan_period?: string
          plan_started_at?: string
          plan_ends_at?: string
          name?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
