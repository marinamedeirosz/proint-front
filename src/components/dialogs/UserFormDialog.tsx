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
import { fieldContext, formContext } from '@/hooks/form-context'
import { TextField, SubscribeButton, SelectField, Switch } from '../FormComponents'
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
      name: '',
      email: '',
      password: '',
      perfil: 'VENDEDOR' as 'ADMIN' | 'VENDEDOR',
      active: true,
    },
    onSubmit: ({ value }) => {
      if (onSave) {
        // Remove password field if empty (for updates)
        const dataToSave: any = { ...value }
        if (!dataToSave.password || dataToSave.password === '') {
          delete dataToSave.password
        }
        onSave(dataToSave)
      }
      onOpenChange(false)
    },
  })

  useEffect(() => {
    if (user) {
      form.setFieldValue('name', user.name)
      form.setFieldValue('email', user.email)
      form.setFieldValue('perfil', user.perfil as 'ADMIN' | 'VENDEDOR')
      form.setFieldValue('active', user.active)
      form.setFieldValue('password', '')
    } else {
      form.setFieldValue('name', '')
      form.setFieldValue('email', '')
      form.setFieldValue('perfil', 'VENDEDOR')
      form.setFieldValue('active', true)
      form.setFieldValue('password', '')
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
              <form.Field name="name">
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

              <form.Field name="password">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <TextField 
                        label={user ? "Senha (deixe em branco para não alterar)" : "Senha"} 
                        type="password"
                      />
                    </div>
                  </fieldContext.Provider>
                )}
              </form.Field>

              <form.Field name="perfil">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <SelectField label="Perfil">
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                      <SelectItem value="VENDEDOR">Vendedor</SelectItem>
                    </SelectField>
                  </fieldContext.Provider>
                )}
              </form.Field>

              <form.Field name="active">
                {(field) => (
                  <fieldContext.Provider value={field}>
                    <div className="grid gap-3">
                      <Switch label="Usuário Ativo" />
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
              <SubscribeButton label={user ? 'Salvar Alterações' : 'Cadastrar Usuário'} />
            </formContext.Provider>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
