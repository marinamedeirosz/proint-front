export type Sale = {
  id: number
  cliente_id: number
  vendedor_id: number
  tipo_contrato_id: number | string
  valor: string
  data: string
  status: 'CRIADA' | 'ATIVA' | 'QUITADA' | 'CANCELADA'
  created_at?: string
  updated_at?: string
  cliente?: {
    id: number
    nome: string
    cpf: string
  }
  vendedor?: {
    id: number
    nome: string
    email: string
    perfil?: string
  }
  tipo_contrato?: {
    id: number | string
    nome: string
    prazo_meses: number
    tempo_nova_oportunidade_dias?: number
    ativo?: boolean
  }
  documentos?: Array<{
    id: number
    cliente_id: number
    tipo: string
    nome_arquivo: string
    file_path: string
    file_url: string
    tamanho_bytes: number
    hash_conteudo: string
    enviado_por_usuario_id: number
    enviado_em: string
    created_at: string
    updated_at: string
  }>
}