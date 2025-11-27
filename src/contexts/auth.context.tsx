import { createContext, useContext, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner';

type SessionData = {
  user: SessionUser;
  token: string;
}

export type SessionUser = {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  session: SessionData | undefined
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionData>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setSession(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      // TODO: Chamar a API real de autenticação aqui
      await new Promise((resolve) => setTimeout(resolve, 4000))
      
      if (email && password) {
        const data: SessionData = {
          user: {
            id: '1',
            email,
            name: email.split('@')[0],
          },
          token: 'fake-token',
        }
        return data
      } else {
        throw new Error('Credenciais inválidas')
      }
    },
    onSuccess: (data) => {
      setSession(data)
      localStorage.setItem('session', JSON.stringify(data))
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })

  function login(email: string, password: string) {
    toast.promise(
      loginMutation.mutateAsync({ email, password }),
      {
        loading: 'Fazendo login...',
        success: 'Login realizado com sucesso!',
        error: 'Erro ao fazer login. Tente novamente.',
      }
    )
  }

  function logout() {
    setSession(undefined)
    localStorage.removeItem('session')
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
