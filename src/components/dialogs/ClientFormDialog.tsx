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
import { fieldContext, formContext } from '@/hooks/form-context'
import { TextField, SubscribeButton } from '../FormComponents'

interface ClientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client | null
  onSave?: (client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'documentos'>) => void
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
      data_nascimento: '',
      email: '',
      telefone: '',
      end_logradouro: '',
      end_numero: '',
      end_complemento: '',
      end_bairro: '',
      end_cidade: '',
      end_uf: '',
      end_cep: '',
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
      form.setFieldValue('data_nascimento', client.data_nascimento)
      form.setFieldValue('email', client.email)
      form.setFieldValue('telefone', client.telefone)
      form.setFieldValue('end_logradouro', client.end_logradouro)
      form.setFieldValue('end_numero', client.end_numero)
      form.setFieldValue('end_complemento', client.end_complemento || '')
      form.setFieldValue('end_bairro', client.end_bairro)
      form.setFieldValue('end_cidade', client.end_cidade)
      form.setFieldValue('end_uf', client.end_uf)
      form.setFieldValue('end_cep', client.end_cep)
    } else {
      form.setFieldValue('nome', '')
      form.setFieldValue('cpf', '')
      form.setFieldValue('data_nascimento', '')
      form.setFieldValue('email', '')
      form.setFieldValue('telefone', '')
      form.setFieldValue('end_logradouro', '')
      form.setFieldValue('end_numero', '')
      form.setFieldValue('end_complemento', '')
      form.setFieldValue('end_bairro', '')
      form.setFieldValue('end_cidade', '')
      form.setFieldValue('end_uf', '')
      form.setFieldValue('end_cep', '')
    }
  }, [client, open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-7xl max-h-[90vh] overflow-y-auto w-[95vw]">
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
              <div className="grid grid-cols-3 gap-4">
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

                <form.Field name="data_nascimento">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <div className="grid gap-3">
                        <TextField label="Data de Nascimento" type="date" />
                      </div>
                    </fieldContext.Provider>
                  )}
                </form.Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="email">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <div className="grid gap-3">
                        <TextField label="E-mail" />
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
              </div>

              <div className="grid grid-cols-3 gap-4">
                <form.Field name="end_logradouro">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <div className="grid gap-3">
                        <TextField label="Logradouro" />
                      </div>
                    </fieldContext.Provider>
                  )}
                </form.Field>

                <form.Field name="end_numero">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <div className="grid gap-3">
                        <TextField label="Número" />
                      </div>
                    </fieldContext.Provider>
                  )}
                </form.Field>

                <form.Field name="end_complemento">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <div className="grid gap-3">
                        <TextField label="Complemento" />
                      </div>
                    </fieldContext.Provider>
                  )}
                </form.Field>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <form.Field name="end_bairro">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <div className="grid gap-3">
                        <TextField label="Bairro" />
                      </div>
                    </fieldContext.Provider>
                  )}
                </form.Field>

                <form.Field name="end_cidade">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <div className="grid gap-3">
                        <TextField label="Cidade" />
                      </div>
                    </fieldContext.Provider>
                  )}
                </form.Field>

                <form.Field name="end_uf">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <div className="grid gap-3">
                        <TextField label="UF" />
                      </div>
                    </fieldContext.Provider>
                  )}
                </form.Field>

                <form.Field name="end_cep">
                  {(field) => (
                    <fieldContext.Provider value={field}>
                      <div className="grid gap-3">
                        <TextField label="CEP" />
                      </div>
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
              <SubscribeButton label={client ? 'Salvar Alterações' : 'Cadastrar Cliente'} />
            </formContext.Provider>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
