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

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserFormDialog({ open, onOpenChange }: UserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastro de Usuário</DialogTitle>
          <DialogDescription>
            Cadastre as informações do usuário no formulário abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              defaultValue="peduarte@example.com"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="perfil">Perfil</Label>
            <Input id="perfil" name="perfil" defaultValue="Administrador" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">Cadastrar Usuário</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
