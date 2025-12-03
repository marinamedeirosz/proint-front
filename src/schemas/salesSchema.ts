import { z } from 'zod/v4'

export const salesSchema = z.object({
    clienteId: z.number().min(1, 'Cliente é obrigatório'),
    tipoContrato: z.string().min(2, 'Tipo do contrato deve ter pelo menos 2 caracteres'),
    valor: z.number().min(0, 'Valor deve ser um número positivo'),
    data: z.string().min(1, 'Data é obrigatória'),
    status: z.enum(['Ativo', 'Inativo', 'Pendente'], 'Status inválido'),
})