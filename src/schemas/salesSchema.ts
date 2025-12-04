import { z } from 'zod/v4'

export const salesSchema = z.object({
    cliente_id: z.number().min(1, 'Cliente é obrigatório'),
    tipo_contrato_id: z.union([z.number(), z.string()]).refine(val => val !== 0 && val !== '', 'Tipo de contrato é obrigatório'),
    valor: z.number().min(0, 'Valor deve ser um número positivo'),
    data: z.date({ message: 'Data é obrigatória' }).nullable(),
    status: z.enum(['CRIADA', 'ATIVA', 'QUITADA', 'CANCELADA'], { message: 'Status inválido' }).optional(),
})