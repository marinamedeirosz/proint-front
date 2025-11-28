import { z } from 'zod/v4'

export const salesSchema = z.object({
    tipoContrato: z.string().min(2, 'Tipo do contrato deve ter pelo menos 2 caracteres'),
    valor: z.number().min(0, 'Valor deve ser um número positivo'),
    status: z.enum(['Ativo', 'Inativo', 'Pendente'], 'Status inválido'),
})