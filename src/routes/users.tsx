import { CustomLinkCard } from '@/components/CustomLinkCard'
import { Button } from '@/components/ui/button'
import { UsersTable } from '@/components/tables/UsersTable'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { UserFormDialog } from '@/components/dialogs/UserFormDialog'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [users, setUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('users')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  const handleCreate = (user: any) => {
    // TODO: Integrar com API - POST /users
    const newUser = { ...user, id: Date.now(), ativo: true }
    setUsers([...users, newUser])
    console.log('Criar usuário:', newUser)
    setIsDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-200 via-slate-300 to-slate-400 p-8">
      <Link to="/" className="inline-block mb-4">
        <Button
          variant={'outline'}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </Link>
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold">Gerenciamento de Usuários</h1>
        <p className="text-lg text-slate-700">
          Aqui você pode gerenciar os usuários do sistema. Adicione, edite ou
          remova usuários conforme necessário.
        </p>
        <CustomLinkCard
          icon={<Plus className="w-12 h-12 text-green-500" />}
          title="Cadastrar Usuário"
          desc="Adicione um novo usuário ao sistema."
          onClick={() => setIsDialogOpen(true)}
        />
      </div>
      <div className="bg-white flex flex-col justify-center mt-8 rounded-lg p-4 shadow-md w-[80%] mx-auto">
        <UsersTable 
          initialData={users}
          onDataChange={setUsers}
        />
      </div>
      <UserFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={handleCreate}
      />
    </div>
  )
}
