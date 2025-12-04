import { z } from 'zod/v4'

export const contractSchema = z.object({
    nome: z.string().min(2, 'Nome do contrato deve ter pelo menos 2 caracteres'),
    prazo_meses: z.number().min(1, 'Prazo deve ser pelo menos 1 mês'),
    tempo_nova_oportunidade_dias: z.number().min(1, 'Tempo deve ser pelo menos 1 dia'),
    ativo: z.boolean().optional(),
})