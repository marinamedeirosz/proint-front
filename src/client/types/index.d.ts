export type Client = {
  id: number
  nome: string
  cpf: string
  data_nascimento: string
  email: string
  telefone: string
  end_logradouro: string
  end_numero: string
  end_complemento?: string
  end_bairro: string
  end_cidade: string
  end_uf: string
  end_cep: string
  created_at?: string
  updated_at?: string
  documentos?: Document[]
}

export type Document = {
  id: number
  cliente_id: number
  tipo: 'RG' | 'CPF' | 'CNH' | 'CONTRACHEQUE' | 'COMP_RESIDENCIA' | 'OUTROS'
  nome_arquivo: string
  file_path: string
  file_url: string
  tamanho_bytes: number
  hash_conteudo: string
  enviado_por_usuario_id: number
  enviado_em: string
  created_at: string
  updated_at: string
}