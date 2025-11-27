import { Button } from '@/components/ui/button'
import { UsersTable } from '@/components/users/UsersTable'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-200 via-slate-300 to-slate-400 p-8">
      <Link to="/" className="inline-block mb-4">
        <Button variant={'outline'} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </Link>
      <div className="flex flex-col items-center ">
        <h1 className="text-4xl font-bold mb-6">Gerenciamento de Usuários</h1>
        <p className="text-lg text-slate-700">
          Aqui você pode gerenciar os usuários do sistema. Adicione, edite ou
          remova usuários conforme necessário.
        </p>
      </div>
      <div className="bg-white flex flex-col justify-center mt-8 rounded-lg p-4 shadow-md w-[80%] mx-auto">
        <div className="flex justify-start">
          <Button
            variant={'default'}
            className="flex items-center gap-2 cursor-pointer w-fit"
          >
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
        <UsersTable />
      </div>
    </div>
  )
}
