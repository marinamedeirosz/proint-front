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
import { User } from '@/user/types'
import { userSchema } from '@/schemas/userSchema'
import { fieldContext, formContext } from '@/hooks/form-context'
import { TextField, SubscribeButton, SelectField } from '../FormComponents'
import { SelectItem } from '../ui/select'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSave?: (user: Partial<User>) => void
}

export function UserFormDialog({ open, onOpenChange, user, onSave }: UserFormDialogProps) {
  const form = useForm({
    defaultValues: {
      nome: '',
      email: '',
      perfil: 'vendedor',
    },
    validators: {
      onChange: userSchema,
    },
    onSubmit: ({ value }) => {
      if (onSave) {
        onSave(value)
      }
      onOpenChange(false)
    },
  })

  useEffect(() => {
    if (user) {
      form.setFieldValue('nome', user.nome)
      form.setFieldValue('email', user.email)
      form.setFieldValue('perfil', user.perfil)
    } else {
      form.setFieldValue('nome', '')
      form.setFieldValue('email', '')
      form.setFieldValue('perfil', 'vendedor')
    }
  }, [user, open, form])

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
            <DialogTitle>{user ? 'Editar Usuário' : 'Cadastro de Usuário'}</DialogTitle>
            <DialogDescription className='mb-5'>
              {user ? 'Edite as informações do usuário.' : 'Cadastre as informações do usuário no formulário abaixo.'}
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

              <form.Field name="email">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <TextField label="E-mail" />
                    </div>
                  </fieldContext.Provider>
                )}
              </form.Field>

              <form.Field name="perfil">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <SelectField label="Perfil">
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="vendedor">Vendedor</SelectItem>
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
              <SubscribeButton label={user ? 'Salvar Alterações' : 'Cadastrar Usuário'} />
            </formContext.Provider>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
