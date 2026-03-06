export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orcamentos: {
        Row: {
          id: string
          cliente_nome: string
          telefone: string | null
          veiculo: string | null
          placa: string | null
          status: string | null
          observacoes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          cliente_nome: string
          telefone?: string | null
          veiculo?: string | null
          placa?: string | null
          status?: string | null
          observacoes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          cliente_nome?: string
          telefone?: string | null
          veiculo?: string | null
          placa?: string | null
          status?: string | null
          observacoes?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      orcamento_servicos: {
        Row: {
          id: string
          orcamento_id: string | null
          descricao: string
          valor: number
        }
        Insert: {
          id?: string
          orcamento_id?: string | null
          descricao: string
          valor: number
        }
        Update: {
          id?: string
          orcamento_id?: string | null
          descricao?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "orcamento_servicos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          }
        ]
      }
      orcamento_materiais: {
        Row: {
          id: string
          orcamento_id: string | null
          nome: string
          quantidade: number | null
          valor_unitario: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          orcamento_id?: string | null
          nome: string
          quantidade?: number | null
          valor_unitario?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          orcamento_id?: string | null
          nome?: string
          quantidade?: number | null
          valor_unitario?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamento_materiais_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          }
        ]
      }
      oficina: {
        Row: {
          id: string
          nome: string
          cnpj: string | null
          telefone: string | null
          email: string | null
          endereco: string | null
          cidade: string | null
          estado: string | null
          cep: string | null
          logo_path: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          nome: string
          cnpj?: string | null
          telefone?: string | null
          email?: string | null
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          logo_path?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          nome?: string
          cnpj?: string | null
          telefone?: string | null
          email?: string | null
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          logo_path?: string | null
          created_at?: string | null
        }
        Relationships: []
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


