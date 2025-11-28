import { z } from 'zod/v4';

export const userSchema = z.object({
    nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.email('Email inválido'),
    perfil: z.string().min(2, 'Perfil deve ter pelo menos 2 caracteres'),
})