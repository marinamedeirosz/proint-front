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
import { useEffect, useState } from 'react'
import { Sale } from '@/sale/types'

interface SalesFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale?: Sale | null
  onSave?: (sale: Partial<Sale>) => void
}

export function SalesFormDialog({ open, onOpenChange, sale, onSave }: SalesFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Sale>>({
    cliente: '',
    tipoContrato: '',
    valor: '',
    data: '',
    status: 'Ativo',
  })

  useEffect(() => {
    if (sale) {
      setFormData(sale)
    } else {
      setFormData({
        cliente: '',
        tipoContrato: '',
        valor: '',
        data: '',
        status: 'Ativo',
      })
    }
  }, [sale, open])

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
            <DialogTitle>{sale ? 'Editar Venda' : 'Cadastro de Venda'}</DialogTitle>
            <DialogDescription className='mb-5'>
              {sale ? 'Edite as informações da venda.' : 'Cadastre as informações da venda no formulário abaixo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="cliente">Cliente</Label>
              <Input 
                id="cliente" 
                name="cliente" 
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tipoContrato">Tipo do Contrato</Label>
              <Select 
                value={formData.tipoContrato} 
                onValueChange={(value) => setFormData({ ...formData, tipoContrato: value })}
              >
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
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder="R$ 0,00"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="data">Data</Label>
              <Input 
                id="data" 
                name="data" 
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">{sale ? 'Salvar Alterações' : 'Cadastrar Venda'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
