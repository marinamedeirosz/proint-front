import { ContractsTable } from '@/components/tables/ContractsTable'
import { CustomLinkCard } from '@/components/CustomLinkCard'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { ContractFormDialog } from '@/components/dialogs/ContractFormDialog'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import type { Contract } from '@/contract/types'
import { toast } from 'sonner'
import { api } from '@/lib/api'

export const Route = createFileRoute('/contracts')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const contractsQuery = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const response = await api.get<Contract[]>('/tipos-contrato')
      return response
    },
  })

  const createContractMutation = useMutation({
    mutationFn: async (contractData: Omit<Contract, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await api.post<Contract>('/tipos-contrato', contractData)
      return response
    },
    onSuccess: () => {
      contractsQuery.refetch()
      setIsDialogOpen(false)
    },
  })

  const updateContractMutation = useMutation({
    mutationFn: async ({ id, ...contractData }: Partial<Contract> & { id: string | number }) => {
      const response = await api.put<Contract>(`/tipos-contrato/${id}`, contractData)
      return response
    },
    onSuccess: () => {
      contractsQuery.refetch()
    },
  })

  const deleteContractMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await api.delete(`/tipos-contrato/${id}`)
    },
    onSuccess: () => {
      contractsQuery.refetch()
    },
  })

  const handleCreate = async (contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>) => {
    const promise = createContractMutation.mutateAsync(contract)
    
    toast.promise(promise, {
      loading: 'Criando tipo de contrato...',
      success: 'Tipo de contrato criado com sucesso!',
      error: (error: any) => {
        if (error.response?.status === 403) {
          return 'Você não tem permissão para criar tipos de contrato.'
        } else if (error.response?.status === 422) {
          return error.response?.data?.message || 'Erro de validação. Verifique os dados.'
        }
        return 'Erro ao criar tipo de contrato. Tente novamente.'
      },
    })

    await promise
  }

  const handleUpdate = async (contract: Partial<Contract> & { id: string | number }) => {
    const promise = updateContractMutation.mutateAsync(contract)
    
    toast.promise(promise, {
      loading: 'Atualizando tipo de contrato...',
      success: 'Tipo de contrato atualizado com sucesso!',
      error: (error: any) => {
        if (error.response?.status === 403) {
          return 'Você não tem permissão para atualizar tipos de contrato.'
        } else if (error.response?.status === 404) {
          return 'Tipo de contrato não encontrado.'
        } else if (error.response?.status === 422) {
          return error.response?.data?.message || 'Erro de validação. Verifique os dados.'
        }
        return 'Erro ao atualizar tipo de contrato. Tente novamente.'
      },
    })

    await promise
  }

  const handleDelete = async (id: string | number) => {
    const promise = deleteContractMutation.mutateAsync(id)
    
    toast.promise(promise, {
      loading: 'Removendo tipo de contrato...',
      success: 'Tipo de contrato removido com sucesso!',
      error: (error: any) => {
        if (error.response?.status === 404) {
          return 'Tipo de contrato não encontrado.'
        }
        return 'Erro ao remover tipo de contrato. Tente novamente.'
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
        <h1 className="text-4xl font-bold">Gerenciamento de Contratos</h1>
        <p className="text-lg text-slate-700">
          Aqui você pode gerenciar os contratos do sistema. Adicione, edite ou
          remova contratos conforme necessário.
        </p>
        <CustomLinkCard
          icon={<Plus className="w-12 h-12 text-green-500" />}
          title="Novo Contrato"
          desc="Crie um novo contrato no sistema."
          onClick={() => setIsDialogOpen(true)}
        />
      </div>
      <div className="bg-white flex flex-col justify-center mt-8 rounded-lg p-4 shadow-md w-[80%] mx-auto">
        {contractsQuery.isLoading ? (
          <div className="text-center py-8">Carregando tipos de contrato...</div>
        ) : contractsQuery.error ? (
          <div className="text-center py-8 text-red-600">
            Erro ao carregar tipos de contrato. {contractsQuery.error instanceof Error ? contractsQuery.error.message : 'Tente novamente.'}
          </div>
        ) : (
          <ContractsTable 
            initialData={contractsQuery.data || []}
            onEdit={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </div>
      <ContractFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={handleCreate}
      />
    </div>
  )
}
