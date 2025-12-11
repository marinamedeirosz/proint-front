import { CustomLinkCard } from '@/components/CustomLinkCard'
import { auth } from '@/lib/auth'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { Banknote, ReceiptText, ShieldUser, User } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

function App() {
   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated())
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return (
    <div className="h-full bg-linear-to-br from-slate-200 via-slate-300 to-slate-400 p-8 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 mb-12">
        <h1 className="text-6xl text-neutral-800 tracking-tight">
          Gerenciador de Empréstimo Consignado
        </h1>
        <p className="text-lg text-slate-700 leading-relaxed text-center max-w-2xl">
          Bem-vindo ao sistema de gestão de empréstimo consignado. Utilize o
          menu abaixo para navegar pelas diferentes funcionalidades do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        <CustomLinkCard
          icon={<ShieldUser className="w-12 h-12 text-cyan-500" />}
          title="Gerenciar Usuários"
          desc="Faça a gestão dos usuários do sistema."
          to={'/users'}
        />
        <CustomLinkCard
          icon={<ReceiptText className="w-12 h-12 text-blue-500" />}
          title="Contratos"
          desc="Gerencie os contratos de empréstimo consignado."
          to={'/contracts'}
        />
        <CustomLinkCard
          icon={<User className="w-12 h-12 text-purple-500" />}
          title="Clientes"
          desc="Gerencie os clientes do sistema."
          to={'/clients'}
        />
        <CustomLinkCard
          icon={<Banknote className="w-12 h-12 text-green-500" />}
          title="Vendas"
          desc="Gerencie as vendas do sistema."
          to={'/sales'}
        />
      </div>
    </div>
  )
}
