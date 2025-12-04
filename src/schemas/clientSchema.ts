import { z } from 'zod/v4';
import { validateCPF } from '../utils/validateCPF';
import { validatePhone } from '../utils/validatePhone';
import { validateCEP } from '../utils/validateCEP';

export const clientSchema = z.object({
    nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    cpf: z.string().refine(validateCPF, {
      error: 'CPF inválido',
      abort: true,
    }),
    data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
    email: z.string().email('Email inválido'),
    telefone: z
      .string()
      .min(1, 'Telefone é obrigatório')
      .refine(validatePhone, 'Telefone deve estar no formato (XX) X XXXX-XXXX'),
    end_logradouro: z.string().min(1, 'Logradouro é obrigatório'),
    end_numero: z.string().min(1, 'Número é obrigatório'),
    end_complemento: z.string().optional(),
    end_bairro: z.string().min(1, 'Bairro é obrigatório'),
    end_cidade: z.string().min(1, 'Cidade é obrigatória'),
    end_uf: z.string().length(2, 'UF deve ter 2 caracteres'),
    end_cep: z
      .string()
      .min(8, 'CEP deve ter pelo menos 8 caracteres')
      .refine(validateCEP, 'CEP não encontrado'),
})