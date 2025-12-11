import { CustomLinkCard } from '@/components/CustomLinkCard'
import { Button } from '@/components/ui/button'
import { UsersTable } from '@/components/tables/UsersTable'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { useState } from 'react'
import { UserFormDialog } from '@/components/dialogs/UserFormDialog'
import { useQuery, useMutation } from '@tanstack/react-query'
import type { User } from '@/user/types'
import { toast } from 'sonner'
import { api } from '@/lib/api'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get<User[]>('/users')
      return response
    },
  })

  const createUserMutation = useMutation({
    mutationFn: async (userData: Omit<User, 'id'> & { password: string }) => {
      const response = await api.post<User>('/users', userData)
      return response
    },
    onSuccess: () => {
      usersQuery.refetch()
      setIsDialogOpen(false)
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...userData }: Partial<User> & { id: number }) => {
      const response = await api.put<User>(`/users/${id}`, userData)
      return response
    },
    onSuccess: () => {
      usersQuery.refetch()
    },
  })

  const handleCreate = async (user: any) => {
    const promise = createUserMutation.mutateAsync(user);
    
    toast.promise(promise, {
      loading: 'Criando usuário...',
      success: 'Usuário criado com sucesso!',
      error: (error: any) => {
        if (error.response?.status === 403) {
          return 'Você não tem permissão para criar usuários.'
        } else if (error.response?.status === 422) {
          return error.response?.data?.message || 'Erro de validação. Verifique os dados.'
        }
        return 'Erro ao criar usuário. Tente novamente.'
      },
    });

    await promise;
  }

  const handleUpdate = async (user: any) => {
    const promise = updateUserMutation.mutateAsync(user);
    
    toast.promise(promise, {
      loading: 'Atualizando usuário...',
      success: 'Usuário atualizado com sucesso!',
      error: (error: any) => {
        if (error.response?.status === 403) {
          return 'Você não tem permissão para atualizar usuários.'
        } else if (error.response?.status === 404) {
          return 'Usuário não encontrado.'
        } else if (error.response?.status === 422) {
          return error.response?.data?.message || 'Erro de validação. Verifique os dados.'
        }
        return 'Erro ao atualizar usuário. Tente novamente.'
      },
    });

    await promise;
  }

  const handleDelete = async (id: number) => {
    const promise = api.delete(`/users/${id}`);
    toast.promise(promise, {
      loading: 'Removendo usuário...',
      success: 'Usuário removido com sucesso!',
      error: (error: any) => {
        return error.response?.data?.message || 'Erro ao remover usuário. Tente novamente.'
      },
    });
    await promise;

    usersQuery.refetch();
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
        {usersQuery.isLoading ? (
          <div className="text-center py-8">Carregando usuários...</div>
        ) : usersQuery.error ? (
          <div className="text-center py-8 text-red-600">
            Erro ao carregar usuários. {usersQuery.error instanceof Error ? usersQuery.error.message : 'Tente novamente.'}
          </div>
        ) : (
          <UsersTable 
            initialData={usersQuery.data || []}
            onDataChange={() => usersQuery.refetch()}
            onEdit={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </div>
      <UserFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={handleCreate}
      />
    </div>
  )
}
