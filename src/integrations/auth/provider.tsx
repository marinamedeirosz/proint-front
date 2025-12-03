import { AuthProvider as AuthContextProvider } from '../../contexts/auth.context'

export function getContext() {
  if (typeof window !== 'undefined') {
    const storedSession = localStorage.getItem('session')
    return { 
      isAuthenticated: !!storedSession, 
      isAuthLoading: false 
    }
  }
  
  return { 
    isAuthenticated: false, 
    isAuthLoading: false 
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>
}
