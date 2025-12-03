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
import { salesSchema } from '@/schemas/salesSchema'
import { fieldContext, formContext } from '@/hooks/form-context'
import { SubscribeButton, SelectField, NumberField, DatePickerField, ComboboxField } from '../FormComponents'
import type { ComboboxOption } from '@/components/ui/combobox'

// Mock client data
const mockClients = Array.from({ length: 50 }, (_, i) => ({
  value: String(i + 1),
  label: `Cliente ${i + 1}`,
}))

interface SalesFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale?: Sale | null
  onSave?: (sale: Partial<Sale>) => void
}

export function SalesFormDialog({ 
  open, 
  onOpenChange, 
  sale, 
  onSave,
}: SalesFormDialogProps) {
  const fetchClients = async ({ search, page, pageSize }: { search: string; page: number; pageSize: number }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // Filter clients by search term
    const filtered = mockClients.filter(client =>
      client.label.toLowerCase().includes(search.toLowerCase())
    )

    // Paginate results
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
      clienteId: 0,
      tipoContrato: '',
      valor: 0,
      data: new Date() as Date | null,
      status: 'Ativo' as 'Ativo' | 'Inativo' | 'Pendente',
    },
    validators: {
      onChange: salesSchema,
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
      form.setFieldValue('clienteId', sale.clienteId)
      form.setFieldValue('tipoContrato', sale.tipoContrato)
      form.setFieldValue('valor', Number(sale.valor) || 0)
      form.setFieldValue('data', sale.data ? new Date(sale.data) : null)
      form.setFieldValue('status', sale.status as 'Ativo' | 'Inativo' | 'Pendente')
    } else {
      form.setFieldValue('clienteId', 0)
      form.setFieldValue('tipoContrato', '')
      form.setFieldValue('valor', 0)
      form.setFieldValue('data', null)
      form.setFieldValue('status', 'Ativo')
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
              <form.Field name="clienteId">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <ComboboxField
                      label="Cliente"
                      placeholder="Selecione um cliente..."
                      searchPlaceholder="Buscar cliente..."
                      emptyText="Nenhum cliente encontrado."
                      fetchOptions={fetchClients}
                    />
                  </fieldContext.Provider>
                )}
              </form.Field>

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="tipoContrato">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <SelectField label="Tipo do Contrato">
                        <SelectItem value="consignado-inss-84x">Consignado INSS 84x</SelectItem>
                        <SelectItem value="consignado-inss-60x">Consignado INSS 60x</SelectItem>
                        <SelectItem value="consignado-privado-48x">Consignado Privado 48x</SelectItem>
                      </SelectField>
                    </fieldContext.Provider>
                  )}
                </form.Field>

                <form.Field name="status">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <SelectField label="Status">
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
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
