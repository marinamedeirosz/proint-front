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
import { fieldContext, formContext } from '@/hooks/form-context'
import { TextField, SubscribeButton, NumberField, Switch } from '../FormComponents'

interface ContractFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract?: Contract | null
  onSave?: (contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>) => void
}

export function ContractFormDialog({
  open,
  onOpenChange,
  contract,
  onSave,
}: ContractFormDialogProps) {
  const form = useForm({
    defaultValues: {
      nome: '',
      prazo_meses: 0,
      tempo_nova_oportunidade_dias: 0,
      ativo: true,
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
      form.setFieldValue('nome', contract.nome)
      form.setFieldValue('prazo_meses', contract.prazo_meses)
      form.setFieldValue('tempo_nova_oportunidade_dias', contract.tempo_nova_oportunidade_dias)
      form.setFieldValue('ativo', contract.ativo)
    } else {
      form.setFieldValue('nome', '')
      form.setFieldValue('prazo_meses', 0)
      form.setFieldValue('tempo_nova_oportunidade_dias', 0)
      form.setFieldValue('ativo', true)
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
              <form.Field name="nome">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <TextField label="Nome do Contrato" />
                    </div>
                  </fieldContext.Provider>
                )}
              </form.Field>

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="prazo_meses">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <div className="grid gap-3">
                        <NumberField label="Prazo (meses)" />
                      </div>
                    </fieldContext.Provider>
                  )}
                </form.Field>

                <form.Field name="tempo_nova_oportunidade_dias">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <div className="grid gap-3">
                        <NumberField label="Nova Oportunidade (dias)" />
                      </div>
                    </fieldContext.Provider>
                  )}
                </form.Field>
              </div>

              <form.Field name="ativo">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <Switch label="Contrato Ativo" />
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
