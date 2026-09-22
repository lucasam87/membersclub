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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assinaturas: {
        Row: {
          data_vencimento: string | null
          gateway: string | null
          id: string
          status: string
          usuario_id: string
        }
        Insert: {
          data_vencimento?: string | null
          gateway?: string | null
          id?: string
          status?: string
          usuario_id: string
        }
        Update: {
          data_vencimento?: string | null
          gateway?: string | null
          id?: string
          status?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      aulas: {
        Row: {
          categoria_id: string
          descricao: string | null
          id: string
          ordem: number
          titulo: string
          youtube_url: string
        }
        Insert: {
          categoria_id: string
          descricao?: string | null
          id?: string
          ordem?: number
          titulo: string
          youtube_url: string
        }
        Update: {
          categoria_id?: string
          descricao?: string | null
          id?: string
          ordem?: number
          titulo?: string
          youtube_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "aulas_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      banner: {
        Row: {
          ativo: boolean
          id: string
          imagem_url: string
          link_destino: string | null
          ordem: number
          titulo: string
        }
        Insert: {
          ativo?: boolean
          id?: string
          imagem_url: string
          link_destino?: string | null
          ordem?: number
          titulo: string
        }
        Update: {
          ativo?: boolean
          id?: string
          imagem_url?: string
          link_destino?: string | null
          ordem?: number
          titulo?: string
        }
        Relationships: []
      }
      categorias: {
        Row: {
          categoria_pai_id: string | null
          id: string
          nome: string
          ordem: number
          slug: string
        }
        Insert: {
          categoria_pai_id?: string | null
          id?: string
          nome: string
          ordem?: number
          slug: string
        }
        Update: {
          categoria_pai_id?: string | null
          id?: string
          nome?: string
          ordem?: number
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_categoria_pai_id_fkey"
            columns: ["categoria_pai_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      materiais: {
        Row: {
          aula_id: string
          id: string
          nome_arquivo: string
          tipo: string | null
          url_arquivo: string
        }
        Insert: {
          aula_id: string
          id?: string
          nome_arquivo: string
          tipo?: string | null
          url_arquivo: string
        }
        Update: {
          aula_id?: string
          id?: string
          nome_arquivo?: string
          tipo?: string | null
          url_arquivo?: string
        }
        Relationships: [
          {
            foreignKeyName: "materiais_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_pessoais: {
        Row: {
          aula_id: string
          conteudo: string | null
          id: string
          usuario_id: string
        }
        Insert: {
          aula_id: string
          conteudo?: string | null
          id?: string
          usuario_id: string
        }
        Update: {
          aula_id?: string
          conteudo?: string | null
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notas_pessoais_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_pessoais_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      progresso_aluno: {
        Row: {
          aula_id: string
          concluida: boolean
          id: string
          liberada: boolean
          usuario_id: string
        }
        Insert: {
          aula_id: string
          concluida?: boolean
          id?: string
          liberada?: boolean
          usuario_id: string
        }
        Update: {
          aula_id?: string
          concluida?: boolean
          id?: string
          liberada?: boolean
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progresso_aluno_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progresso_aluno_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_alternativas: {
        Row: {
          correta: boolean
          id: string
          pergunta_id: string
          texto: string
        }
        Insert: {
          correta?: boolean
          id?: string
          pergunta_id: string
          texto: string
        }
        Update: {
          correta?: boolean
          id?: string
          pergunta_id?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_alternativas_pergunta_id_fkey"
            columns: ["pergunta_id"]
            isOneToOne: false
            referencedRelation: "quiz_perguntas"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_perguntas: {
        Row: {
          enunciado: string
          id: string
          ordem: number
          quiz_id: string
        }
        Insert: {
          enunciado: string
          id?: string
          ordem?: number
          quiz_id: string
        }
        Update: {
          enunciado?: string
          id?: string
          ordem?: number
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_perguntas_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_tentativas: {
        Row: {
          aprovado: boolean
          criado_em: string
          id: string
          nota: number
          quiz_id: string
          usuario_id: string
        }
        Insert: {
          aprovado: boolean
          criado_em?: string
          id?: string
          nota: number
          quiz_id: string
          usuario_id: string
        }
        Update: {
          aprovado?: boolean
          criado_em?: string
          id?: string
          nota?: number
          quiz_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_tentativas_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_tentativas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          aula_id: string
          id: string
          max_tentativas: number
          nota_minima: number
        }
        Insert: {
          aula_id: string
          id?: string
          max_tentativas?: number
          nota_minima?: number
        }
        Update: {
          aula_id?: string
          id?: string
          max_tentativas?: number
          nota_minima?: number
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: true
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          papel: string
          status_assinatura: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          nome?: string
          papel?: string
          status_assinatura?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          papel?: string
          status_assinatura?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      quiz_alternativas_do_quiz: {
        Args: { p_quiz_id: string }
        Returns: {
          id: string
          pergunta_id: string
          texto: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
