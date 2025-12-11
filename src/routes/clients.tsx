import { ClientsTable } from '@/components/tables/ClientsTable'
import { CustomLinkCard } from '@/components/CustomLinkCard'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { ClientFormDialog } from '@/components/dialogs/ClientFormDialog'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import type { Client } from '@/client/types'
import { toast } from 'sonner'
import { api } from '@/lib/api'

export const Route = createFileRoute('/clients')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await api.get<Client[]>('/clientes')
      return response
    },
  })

  const createClientMutation = useMutation({
    mutationFn: async (clientData: Omit<Client, 'id'>) => {
      const response = await api.post<Client>('/clientes', clientData)
      return response
    },
    onSuccess: () => {
      clientsQuery.refetch()
      setIsDialogOpen(false)
    },
  })

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, ...clientData }: Partial<Client> & { id: number }) => {
      const response = await api.put<Client>(`/clientes/${id}`, clientData)
      return response
    },
    onSuccess: () => {
      clientsQuery.refetch()
    },
  })

  const deleteClientMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/clientes/${id}`)
    },
    onSuccess: () => {
      clientsQuery.refetch()
    },
  })

  const handleCreate = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'documentos'>) => {
    const promise = createClientMutation.mutateAsync(client)
    
    toast.promise(promise, {
      loading: 'Criando cliente...',
      success: 'Cliente criado com sucesso!',
      error: (error: any) => {
        if (error.response?.status === 422) {
          return error.response?.data?.message || 'Erro de validação. Verifique os dados.'
        }
        return 'Erro ao criar cliente. Tente novamente.'
      },
    })

    await promise
  }

  const handleUpdate = async (client: Partial<Client> & { id: number }) => {
    const promise = updateClientMutation.mutateAsync(client)
    
    toast.promise(promise, {
      loading: 'Atualizando cliente...',
      success: 'Cliente atualizado com sucesso!',
      error: (error: any) => {
        if (error.response?.status === 404) {
          return 'Cliente não encontrado.'
        } else if (error.response?.status === 422) {
          return error.response?.data?.message || 'Erro de validação. Verifique os dados.'
        }
        return 'Erro ao atualizar cliente. Tente novamente.'
      },
    })

    await promise
  }

  const handleDelete = async (id: number) => {
    const promise = deleteClientMutation.mutateAsync(id)
    
    toast.promise(promise, {
      loading: 'Removendo cliente...',
      success: 'Cliente removido com sucesso!',
      error: (error: any) => {
        if (error.response?.status === 404) {
          return 'Cliente não encontrado.'
        }
        return 'Erro ao remover cliente. Tente novamente.'
      },
    })

    await promise
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
        <h1 className="text-4xl font-bold">Gerenciamento de Clientes</h1>
        <p className="text-lg text-slate-700">
          Aqui você pode gerenciar os clientes do sistema. Adicione, edite ou
          remova clientes conforme necessário.
        </p>
        <CustomLinkCard
          icon={<Plus className="w-12 h-12 text-green-500" />}
          title="Cadastrar Cliente"
          desc="Adicione um novo cliente ao sistema."
          onClick={() => setIsDialogOpen(true)}
        />
      </div>
      <div className='bg-white rounded-lg shadow-md p-6 mt-8 w-[80%] mx-auto'>
        {clientsQuery.isLoading ? (
          <div className="text-center py-8">Carregando clientes...</div>
        ) : clientsQuery.error ? (
          <div className="text-center py-8 text-red-600">
            Erro ao carregar clientes. {clientsQuery.error instanceof Error ? clientsQuery.error.message : 'Tente novamente.'}
          </div>
        ) : (
          <ClientsTable 
            initialData={clientsQuery.data || []}
            onDataChange={() => clientsQuery.refetch()}
            onEdit={handleUpdate}
            onDelete={handleDelete}
          />
        )}
       </div>
      
      <ClientFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={handleCreate}
      />
    </div>
  )
}
