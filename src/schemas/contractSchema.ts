import { z } from 'zod/v4'

export const contractSchema = z.object({
    nomeContrato: z.string().min(2, 'Nome do contrato deve ter pelo menos 2 caracteres'),
    prazo: z.number().min(1, 'Prazo deve ser pelo menos 1 mês'),
    novaOportunidadeEm: z.number().min(0, 'Nova oportunidade deve ser 0 ou mais meses'),
})