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
import { SubscribeButton, SelectField, NumberField, TextField, ComboboxField } from '../FormComponents'
import type { ComboboxOption } from '@/components/ui/combobox'

interface SalesFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale?: Sale | null
  onSave?: (sale: Partial<Sale>) => void
  fetchClients?: (params: {
    search: string
    page: number
    pageSize: number
  }) => Promise<{ data: ComboboxOption[]; hasMore: boolean; total?: number }>
}

export function SalesFormDialog({ 
  open, 
  onOpenChange, 
  sale, 
  onSave,
  fetchClients,
}: SalesFormDialogProps) {
  const form = useForm({
    defaultValues: {
      clienteId: 0,
      tipoContrato: '',
      valor: 0,
      data: '',
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
      form.setFieldValue('data', sale.data)
      form.setFieldValue('status', sale.status as 'Ativo' | 'Inativo' | 'Pendente')
    } else {
      form.setFieldValue('clienteId', 0)
      form.setFieldValue('tipoContrato', '')
      form.setFieldValue('valor', 0)
      form.setFieldValue('data', '')
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

              <form.Field name="valor">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <NumberField label="Valor" placeholder="R$ 0,00" />
                    </div>
                  </fieldContext.Provider>
                )}
              </form.Field>

              <form.Field name="data">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <TextField label="Data" placeholder="DD/MM/AAAA" />
                    </div>
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
