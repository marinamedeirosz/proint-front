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
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useEffect, useState } from 'react'
import { User } from '@/user/types'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSave?: (user: Partial<User>) => void
}

export function UserFormDialog({ open, onOpenChange, user, onSave }: UserFormDialogProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    nome: '',
    email: '',
    perfil: 'vendedor',
  })

  useEffect(() => {
    if (user) {
      setFormData(user)
    } else {
      setFormData({
        nome: '',
        email: '',
        perfil: 'vendedor',
      })
    }
  }, [user, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      onSave(formData)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{user ? 'Editar Usuário' : 'Cadastro de Usuário'}</DialogTitle>
            <DialogDescription className='mb-5'>
              {user ? 'Edite as informações do usuário.' : 'Cadastre as informações do usuário no formulário abaixo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="nome">Nome</Label>
              <Input 
                id="nome" 
                name="nome" 
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="perfil">Perfil</Label>
              <Select value={formData.perfil} onValueChange={(value) => setFormData({ ...formData, perfil: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className='mt-6'>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">{user ? 'Salvar Alterações' : 'Cadastrar Usuário'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
