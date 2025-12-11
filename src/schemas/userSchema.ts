import { z } from 'zod/v4';

export const userSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.email('Email inválido'),
    password: z.string().optional(),
    perfil: z.enum(['ADMIN', 'VENDEDOR'], { message: 'Perfil deve ser ADMIN ou VENDEDOR' }),
    active: z.boolean().optional(),
})