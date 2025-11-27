import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { z } from 'zod'
import { LogIn } from 'lucide-react'
import { useAuth } from '../contexts/auth.context'
import { fieldContext, formContext } from '../hooks/form-context'
import { SubscribeButton, TextField } from '../components/FormComponents'

const loginSchema = z.object({
  email: z.email().nonoptional('Email obrigatório!'),
  password: z
    .string()
    .min(1, 'Senha obrigatória!')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || '/',
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const { login } = useAuth()
  const { redirect } = useSearch({ from: '/login' })
  const [submitError, setSubmitError] = useState<string>('')

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: ({ value }) => {
      setSubmitError('')
      try {
        login(value.email, value.password)
        // Navigate to the redirect URL or home
        window.location.href = redirect
      } catch (err) {
        setSubmitError('Email ou senha inválidos. Tente novamente.')
      }
    },
  })

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

              {submitError && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              <SubscribeButton label="Entrar" buttonClassName="w-full" />
            </formContext.Provider>
          </form>
        </div>
      </div>
    </div>
  )
}
