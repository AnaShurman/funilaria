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
      Cliente: {
        Row: {
          id: number
          created_at: string | null
          cliente_nome: string | null
          cliente_telefone: string | null
          cliente_email: string | null
          cliente_cpf: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          cliente_nome?: string | null
          cliente_telefone?: string | null
          cliente_email?: string | null
          cliente_cpf?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          cliente_nome?: string | null
          cliente_telefone?: string | null
          cliente_email?: string | null
          cliente_cpf?: string | null
        }
        Relationships: []
      }
      veiculos: {
        Row: {
          id: number
          created_at: string | null
          cliente_id: number | null
          veiculo_placa: string
          veiculo_modelo: string | null
          veiculo_marca: string | null
          veiculo_cor: string | null
          veiculo_ano: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          cliente_id?: number | null
          veiculo_placa: string
          veiculo_modelo?: string | null
          veiculo_marca?: string | null
          veiculo_cor?: string | null
          veiculo_ano?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          cliente_id?: number | null
          veiculo_placa?: string
          veiculo_modelo?: string | null
          veiculo_marca?: string | null
          veiculo_cor?: string | null
          veiculo_ano?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "Cliente"
            referencedColumns: ["id"]
          }
        ]
      }
      orcamentos: {
        Row: {
          id: string
          cliente_id: number | null
          veiculo_id: number | null
          cliente_nome: string
          cliente_email: string | null
          cliente_telefone: string | null
          veiculo_modelo: string | null
          veiculo_placa: string | null
          veiculo_ano: string | null
          status: string | null
          observacoes: string | null
          mao_de_obra: number | null
          total_materiais: number | null
          total_servicos: number | null
          valor_total: number | null
          numero_orcamento: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          cliente_id?: number | null
          veiculo_id?: number | null
          cliente_nome: string
          cliente_email?: string | null
          cliente_telefone?: string | null
          veiculo_modelo?: string | null
          veiculo_placa?: string | null
          veiculo_ano?: string | null
          status?: string | null
          observacoes?: string | null
          mao_de_obra?: number | null
          total_materiais?: number | null
          total_servicos?: number | null
          valor_total?: number | null
          numero_orcamento?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          cliente_id?: number | null
          veiculo_id?: number | null
          cliente_nome?: string
          cliente_email?: string | null
          cliente_telefone?: string | null
          veiculo_modelo?: string | null
          veiculo_placa?: string | null
          veiculo_ano?: string | null
          status?: string | null
          observacoes?: string | null
          mao_de_obra?: number | null
          total_materiais?: number | null
          total_servicos?: number | null
          valor_total?: number | null
          numero_orcamento?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "Cliente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          }
        ]
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
          descricao: string | null
          quantidade: number | null
          valor_unitario: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          orcamento_id?: string | null
          nome: string
          descricao?: string | null
          quantidade?: number | null
          valor_unitario?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          orcamento_id?: string | null
          nome?: string
          descricao?: string | null
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

// Made with Bob
