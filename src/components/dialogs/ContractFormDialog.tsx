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
import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { Contract } from '@/contract/types'
import { contractSchema } from '@/schemas/contractSchema'
import { fieldContext, formContext } from '@/hooks/form-context'
import { TextField, SubscribeButton, NumberField } from '../FormComponents'

interface ContractFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract?: Contract | null
  onSave?: (contract: Partial<Contract>) => void
}

export function ContractFormDialog({
  open,
  onOpenChange,
  contract,
  onSave,
}: ContractFormDialogProps) {
  const form = useForm({
    defaultValues: {
      nomeContrato: '',
      prazo: 0,
    },
    validators: {
      onChange: contractSchema,
    },
    onSubmit: ({ value }) => {
      if (onSave) {
        onSave(value)
      }
      onOpenChange(false)
    },
  })

  useEffect(() => {
    if (contract) {
      form.setFieldValue('nomeContrato', contract.nome)
      form.setFieldValue('prazo', contract.prazo)
    } else {
      form.setFieldValue('nomeContrato', '')
      form.setFieldValue('prazo', 0)
    }
  }, [contract, open, form])

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
            <DialogTitle>{contract ? 'Editar Contrato' : 'Cadastro de Contrato'}</DialogTitle>
            <DialogDescription className='mb-5'>
              {contract ? 'Edite as informações do contrato.' : 'Cadastre as informações do contrato no formulário abaixo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <formContext.Provider value={form}>
              <form.Field name="nomeContrato">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <TextField label="Nome do Contrato" />
                    </div>
                  </fieldContext.Provider>
                )}
              </form.Field>

              <form.Field name="prazo">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <NumberField label="Prazo (meses)" />
                    </div>
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
              <SubscribeButton label={contract ? 'Salvar Alterações' : 'Cadastrar Contrato'} />
            </formContext.Provider>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
