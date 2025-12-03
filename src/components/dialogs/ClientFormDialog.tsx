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
import { Client } from '@/client/types'
import { clientSchema } from '@/schemas/clientSchema'
import { fieldContext, formContext } from '@/hooks/form-context'
import { TextField, SubscribeButton } from '../FormComponents'

interface ClientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client | null
  onSave?: (client: Partial<Client>) => void
}

export function ClientFormDialog({
  open,
  onOpenChange,
  client,
  onSave,
}: ClientFormDialogProps) {
  const form = useForm({
    defaultValues: {
      nome: '',
      cpf: '',
      cep: '',
      telefone: '',
      email: '',
    },
    validators: {
      onChange: clientSchema,
    },
    onSubmit: ({ value }) => {
      if (onSave) {
        onSave(value)
      }
      onOpenChange(false)
    },
  })

  useEffect(() => {
    if (client) {
      form.setFieldValue('nome', client.nome)
      form.setFieldValue('cpf', client.cpf)
      form.setFieldValue('cep', client.endereco)
      form.setFieldValue('telefone', client.telefone)
      form.setFieldValue('email', client.email)
    } else {
      form.setFieldValue('nome', '')
      form.setFieldValue('cpf', '')
      form.setFieldValue('cep', '')
      form.setFieldValue('telefone', '')
      form.setFieldValue('email', '')
    }
  }, [client, open, form])

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
            <DialogTitle>{client ? 'Editar Cliente' : 'Cadastro de Cliente'}</DialogTitle>
            <DialogDescription className='mb-5'>
              {client ? 'Edite as informações do cliente.' : 'Cadastre as informações do cliente no formulário abaixo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <formContext.Provider value={form}>
              <form.Field name="nome">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <TextField label="Nome" />
                    </div>
                  </fieldContext.Provider>
                )}
              </form.Field>

              <form.Field name="cpf">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <TextField label="CPF" />
                    </div>
                  </fieldContext.Provider>
                )}
              </form.Field>

              <form.Field name="cep">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <TextField label="CEP" />
                    </div>
                  </fieldContext.Provider>
                )}
              </form.Field>

              <form.Field name="telefone">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <TextField label="Telefone" />
                    </div>
                  </fieldContext.Provider>
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <TextField label="E-mail" />
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
              <SubscribeButton label={client ? 'Salvar Alterações' : 'Cadastrar Cliente'} />
            </formContext.Provider>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
