import { AuthProvider as AuthContextProvider } from '../../contexts/auth.context'

export function getContext() {
  return {}
}

export function Provider({ children }: { children: React.ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>
}
