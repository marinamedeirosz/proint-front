export type Contract = {
  id: string | number
  nome: string
  prazo_meses: number
  tempo_nova_oportunidade_dias: number
  ativo: boolean
  created_at?: string
  updated_at?: string
}