import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { LogIn } from 'lucide-react'
import { fieldContext, formContext } from '../hooks/form-context'
import { SubscribeButton, TextField } from '../components/FormComponents'
import { auth } from '@/lib/auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'

const loginSchema = z.object({
  email: z.email({error: "Email inválido"}).min(1, 'Email obrigatório!'),
  password: z
    .string()
    .min(1, 'Senha obrigatória!')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export const Route = createFileRoute('/login')({ component: LoginPage })

function LoginPage() {
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return api.post<{
        user: { id: string; email: string; name: string; password: string }
        token: string
      }>('/auth/login', credentials)
    },
    onSuccess: (response) => {
      auth.setToken(response.token)
      auth.setUser(response.user)
      navigate({ to: '/' })
    },
  })

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await toastedLogin(value.email, value.password)
    },
  })

  async function toastedLogin(email: string, password: string) {
    const promise = loginMutation.mutateAsync({ email, password });

    toast.promise(promise, {
      loading: 'Fazendo login...',
      success: 'Login realizado com sucesso!',
      error: 'Falha no login. Verifique suas credenciais.',
    });
    await promise;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white backdrop-blur-sm border border-slate-300 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-cyan-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Bem Vindo(a)!</h1>
            <p className="text-slate-600">Faça login na sua conta para continuar</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <formContext.Provider value={form}>
              <form.Field name="email">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <TextField label="Email" placeholder="seu@email.com" />
                  </fieldContext.Provider>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <TextField label="Senha" placeholder="••••••••" />
                  </fieldContext.Provider>
                )}
              </form.Field>
              <SubscribeButton label="Entrar" buttonClassName="w-full" />
            </formContext.Provider>
          </form>
        </div>
      </div>
    </div>
  )
}
