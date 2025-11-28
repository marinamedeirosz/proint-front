import { z } from 'zod/v4';
import { validateCPF } from '../utils/validateCPF';
import { validatePhone } from '../utils/validatePhone';
import { validateCEP } from '../utils/validateCEP';

export const clientSchema = z.object({
    nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    telefone: z
      .string()
      .min(1, 'Telefone é obrigatório')
      .refine(validatePhone, 'Telefone deve estar no formato (XX) X XXXX-XXXX'),
    cpf: z.string().refine(validateCPF, {
      error: 'CPF inválido',
      abort: true,
    }),
    email: z.email('Email inválido'),
    cep: z
      .string()
      .min(8, 'CEP deve ter pelo menos 8 caracteres')
      .refine(validateCEP, 'CEP não encontrado'),
})