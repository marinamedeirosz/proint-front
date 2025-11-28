import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
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

interface SalesFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SalesFormDialog({ open, onOpenChange }: SalesFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastro de Venda</DialogTitle>
          <DialogDescription>
            Cadastre as informações da venda no formulário abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="contractName">Nome do Contrato</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um contrato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consignado-inss-84x">Consignado INSS 84x</SelectItem>
                <SelectItem value="consignado-inss-60x">Consignado INSS 60x</SelectItem>
                <SelectItem value="consignado-privado-48x">Consignado Privado 48x</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              name="valor"
              defaultValue="12.000"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">Cadastrar Venda</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
