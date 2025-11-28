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

interface ClientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientFormDialog({
  open,
  onOpenChange,
}: ClientFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastro de Cliente</DialogTitle>
          <DialogDescription>
            Cadastre as informações do cliente no formulário abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="cpf">CPF</Label>
            <Input id="cpf" name="cpf" defaultValue="123.456.789-00" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="cep">CEP</Label>
            <Input id="cep" name="cep" defaultValue="12345-678" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              name="telefone"
              defaultValue="(12) 34567-8901"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              defaultValue="peduarte@example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">Cadastrar Cliente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
