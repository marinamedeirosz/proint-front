import { CustomLinkCard } from '@/components/CustomLinkCard'
import { SalesFormDialog } from '@/components/dialogs/SalesFormDialog'
import { SalesTable } from '@/components/tables/SalesTable'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import type { Sale } from '@/sale/types'
import { toast } from 'sonner'
import { api } from '@/lib/api'

export const Route = createFileRoute('/sales')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const salesQuery = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const response = await api.get<Sale[]>('/vendas')
      return response
    },
  })

  const createSaleMutation = useMutation({
    mutationFn: async (saleData: Omit<Sale, 'id' | 'vendedor_id' | 'created_at' | 'updated_at' | 'cliente' | 'vendedor' | 'tipo_contrato' | 'documentos'>) => {
      const response = await api.post<Sale>('/vendas', saleData)
      return response.data
    },
    onSuccess: () => {
      salesQuery.refetch()
      setIsDialogOpen(false)
    },
  })

  const updateSaleMutation = useMutation({
    mutationFn: async ({ id, ...saleData }: Partial<Sale> & { id: number }) => {
      const response = await api.put<Sale>(`/vendas/${id}`, saleData)
      return response.data
    },
    onSuccess: () => {
      salesQuery.refetch()
    },
  })

  const cancelSaleMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/vendas/${id}`)
    },
    onSuccess: () => {
      salesQuery.refetch()
    },
  })

  const handleCreate = async (sale: Omit<Sale, 'id' | 'vendedor_id' | 'created_at' | 'updated_at' | 'cliente' | 'vendedor' | 'tipo_contrato' | 'documentos'>) => {
    const promise = createSaleMutation.mutateAsync(sale)
    
    toast.promise(promise, {
      loading: 'Criando venda...',
      success: 'Venda criada com sucesso!',
      error: (error: any) => {
        if (error.response?.status === 422) {
          return error.response?.data?.message || 'Erro de validação. Verifique os dados.'
        }
        return 'Erro ao criar venda. Tente novamente.'
      },
    })

    await promise
  }

  const handleUpdate = async (sale: Partial<Sale> & { id: number }) => {
    const promise = updateSaleMutation.mutateAsync(sale)
    
    toast.promise(promise, {
      loading: 'Atualizando venda...',
      success: 'Venda atualizada com sucesso!',
      error: (error: any) => {
        if (error.response?.status === 404) {
          return 'Venda não encontrada.'
        } else if (error.response?.status === 422) {
          return error.response?.data?.message || 'Erro de validação. Verifique os dados.'
        }
        return 'Erro ao atualizar venda. Tente novamente.'
      },
    })

    await promise
  }

  const handleCancel = async (id: number) => {
    const promise = cancelSaleMutation.mutateAsync(id)
    
    toast.promise(promise, {
      loading: 'Cancelando venda...',
      success: 'Venda cancelada com sucesso!',
      error: (error: any) => {
        if (error.response?.status === 404) {
          return 'Venda não encontrada.'
        }
        return 'Erro ao cancelar venda. Tente novamente.'
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
        <h1 className="text-4xl font-bold">Gerenciamento de Vendas</h1>
        <p className="text-lg text-slate-700">
          Aqui você pode gerenciar as vendas do sistema. Adicione, edite ou
          remova vendas conforme necessário.
        </p>
        <CustomLinkCard
          icon={<Plus className="w-12 h-12 text-green-500" />}
          title="Nova Venda"
          desc="Crie uma nova venda no sistema."
          onClick={() => setIsDialogOpen(true)}
        />
      </div>
      <div className="bg-white flex flex-col justify-center mt-8 rounded-lg p-4 shadow-md w-[80%] mx-auto">
        {salesQuery.isLoading ? (
          <div className="text-center py-8">Carregando vendas...</div>
        ) : salesQuery.error ? (
          <div className="text-center py-8 text-red-600">
            Erro ao carregar vendas. {salesQuery.error instanceof Error ? salesQuery.error.message : 'Tente novamente.'}
          </div>
        ) : (
          <SalesTable 
            initialData={salesQuery.data || []}
            onEdit={handleUpdate}
            onDelete={handleCancel}
          />
        )}
      </div>
      <SalesFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={handleCreate}
      />
    </div>
  )
}
