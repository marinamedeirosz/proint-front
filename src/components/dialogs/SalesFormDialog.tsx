import { Button } from '../ui/button'
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '../ui/dialog'
import { SelectItem } from '../ui/select'
import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { Sale } from '@/sale/types'
import { fieldContext, formContext } from '@/hooks/form-context'
import { SubscribeButton, SelectField, NumberField, DatePickerField, ComboboxField } from '../FormComponents'
import type { ComboboxOption } from '@/components/ui/combobox'
import { useQuery } from '@tanstack/react-query'
import type { Client } from '@/client/types'
import type { Contract } from '@/contract/types'
import { api } from '@/lib/api'

interface SalesFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale?: Sale | null
  onSave?: (sale: Omit<Sale, 'id' | 'vendedor_id' | 'created_at' | 'updated_at' | 'cliente' | 'vendedor' | 'tipo_contrato' | 'documentos'>) => void
}

export function SalesFormDialog({ 
  open, 
  onOpenChange, 
  sale, 
  onSave,
}: SalesFormDialogProps) {  
  const contractsQuery = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const response = await api.get<Contract[]>('/tipos-contrato')
      return response
    },
  })

  const clientsQuery = useQuery({
    queryKey: ['clients', open],
    queryFn: async () => {
      const response = await api.get<Client[]>('/clientes')
      return response
    },
    enabled: open,
  })

  const fetchClientsForCombobox = async ({ search, page, pageSize }: { search: string; page: number; pageSize: number }) => {
    await new Promise(resolve => setTimeout(resolve, 100))

    const filtered = clientsQuery.data!
      .filter(client => client.nome.toLowerCase().includes(search.toLowerCase()))
      .map(client => ({ value: String(client.id), label: client.nome }))

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = filtered.slice(start, end)

    return {
      data: paginatedData as ComboboxOption[],
      hasMore: end < filtered.length,
      total: filtered.length,
    }
  }

  const form = useForm({
    defaultValues: {
      cliente_id: 0,
      tipo_contrato_id: '' as string | number,
      valor: 0,
      data: new Date() as Date | null,
      status: 'CRIADA' as 'CRIADA' | 'ATIVA' | 'QUITADA' | 'CANCELADA',
    },
    onSubmit: ({ value }) => {
      if (onSave) {
        onSave({
          ...value,
          valor: String(value.valor),
          data: value.data ? value.data.toISOString().split('T')[0] : '',
        })
      }
      onOpenChange(false)
    },
  })

  useEffect(() => {
    if (sale) {
      form.setFieldValue('cliente_id', sale.cliente_id)
      form.setFieldValue('tipo_contrato_id', sale.tipo_contrato_id)
      form.setFieldValue('valor', Number(sale.valor) || 0)
      form.setFieldValue('data', sale.data ? new Date(sale.data) : null)
      form.setFieldValue('status', sale.status)
    } else {
      form.setFieldValue('cliente_id', 0)
      form.setFieldValue('tipo_contrato_id', '')
      form.setFieldValue('valor', 0)
      form.setFieldValue('data', null)
      form.setFieldValue('status', 'CRIADA')
    }
  }, [sale, open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <DialogHeader>
            <DialogTitle>{sale ? 'Editar Venda' : 'Cadastro de Venda'}</DialogTitle>
            <DialogDescription className='mb-5'>
              {sale ? 'Edite as informações da venda.' : 'Cadastre as informações da venda no formulário abaixo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <formContext.Provider value={form}>
              <form.Field name="cliente_id">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <ComboboxField
                      label="Cliente"
                      placeholder="Selecione um cliente..."
                      searchPlaceholder="Buscar cliente..."
                      emptyText="Nenhum cliente encontrado."
                      fetchOptions={fetchClientsForCombobox}
                    />
                  </fieldContext.Provider>
                )}
              </form.Field>

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="tipo_contrato_id">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <SelectField label="Tipo do Contrato">
                        {contractsQuery.data?.map((contract) => (
                          <SelectItem key={contract.id} value={String(contract.id)}>
                            {contract.nome}
                          </SelectItem>
                        ))}
                      </SelectField>
                    </fieldContext.Provider>
                  )}
                </form.Field>

                <form.Field name="status">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <SelectField label="Status">
                        <SelectItem value="CRIADA">Criada</SelectItem>
                        <SelectItem value="ATIVA">Ativa</SelectItem>
                        <SelectItem value="QUITADA">Quitada</SelectItem>
                        <SelectItem value="CANCELADA">Cancelada</SelectItem>
                      </SelectField>
                    </fieldContext.Provider>
                  )}
                </form.Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="valor">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <NumberField label="Valor" placeholder="R$ 0,00" />
                    </fieldContext.Provider>
                  )}
                </form.Field>

                <form.Field name="data">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <DatePickerField label="Data" placeholder="Selecione a data" />
                    </fieldContext.Provider>
                  )}
                </form.Field>
              </div>
            </formContext.Provider>
          </div>
          <DialogFooter className='mt-6'>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <formContext.Provider value={form}>
              <SubscribeButton label={sale ? 'Salvar Alterações' : 'Cadastrar Venda'} />
            </formContext.Provider>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
