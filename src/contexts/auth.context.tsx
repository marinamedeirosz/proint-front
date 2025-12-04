import { createContext, useContext, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { httpClient } from '../http/client'

type SessionData = {
  user: SessionUser
  token: string
  token_type: string
}

export type SessionUser = {
  id: number
  nome: string
  email: string
  perfil: string
  active: boolean
}

export interface AuthContextType {
  session: SessionData | undefined
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionData>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }
    
    const storedSession = localStorage.getItem('session')
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession)
        setSession(parsedSession)
        // Restore Authorization header
        httpClient.defaults.headers.common['Authorization'] = `${parsedSession.token_type} ${parsedSession.token}`
      } catch (error) {
        console.error('Failed to parse stored session:', error)
        localStorage.removeItem('session')
      }
    }
    setIsLoading(false)
  }, [])

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await httpClient.post<SessionData>('/auth/login', {
        email,
        password,
      })
      return response.data
    },
    onSuccess: (data) => {
      setSession(data)
      localStorage.setItem('session', JSON.stringify(data))
      // Set Authorization header for all future requests
      httpClient.defaults.headers.common['Authorization'] = `${data.token_type} ${data.token}`
    },
    onError: (error: any) => {
      console.error('Login failed:', error)
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Credenciais inválidas')
      } else if (error.response?.status === 403) {
        throw new Error('Usuário inativo. Entre em contato com o administrador.')
      } else {
        throw new Error('Erro ao fazer login. Tente novamente.')
      }
    },
  })

  async function login(email: string, password: string) {
    try {
      const promise = loginMutation.mutateAsync({ email, password })
      await toast.promise(promise, {
        loading: 'Fazendo login...',
        success: 'Login realizado com sucesso!',
        error: (err) => err.message || 'Erro ao fazer login. Tente novamente.',
      })
    } catch (error: any) {
      throw error
    }
  }

  async function logout() {
    try {
      if (session?.token) {
        await httpClient.post('/auth/logout')
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      setSession(undefined)
      localStorage.removeItem('session')
      // Remove Authorization header
      delete httpClient.defaults.headers.common['Authorization']
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }

  const value: AuthContextType = {
    session,
    isAuthenticated: !!session,
    isLoading: isLoading || loginMutation.isPending,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
