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

interface ContractFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContractFormDialog({ open, onOpenChange }: ContractFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastro de Contrato</DialogTitle>
          <DialogDescription>
            Cadastre as informações do contrato no formulário abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="contractName">Nome do Contrato</Label>
            <Input id="contractName" name="contractName" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="prazo">Prazo (meses)</Label>
            <Input
              id="prazo"
              name="prazo"
              defaultValue="12"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="newOpportunity">Nova oportunidade em:</Label>
            <Input id="newOpportunity" name="newOpportunity" defaultValue="540" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">Cadastrar Contrato</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
