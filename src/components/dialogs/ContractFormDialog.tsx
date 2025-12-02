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
import { Contract } from '@/contract/types'

interface ContractFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract?: Contract | null
  onSave?: (contract: Partial<Contract>) => void
}

export function ContractFormDialog({
  open,
  onOpenChange,
  contract,
  onSave,
}: ContractFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Contract>>({
    nome: '',
    prazo: 0,
    novaOportunidade: 0,
  })

  useEffect(() => {
    if (contract) {
      setFormData(contract)
    } else {
      setFormData({
        nome: '',
        prazo: 0,
        novaOportunidade: 0,
      })
    }
  }, [contract, open])

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
            <DialogTitle>{contract ? 'Editar Contrato' : 'Cadastro de Contrato'}</DialogTitle>
            <DialogDescription className='mb-5'>
              {contract ? 'Edite as informações do contrato.' : 'Cadastre as informações do contrato no formulário abaixo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="nome">Nome do Contrato</Label>
              <Input 
                id="nome" 
                name="nome" 
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="prazo">Prazo (meses)</Label>
              <Input
                id="prazo"
                name="prazo"
                type="tel"
                value={formData.prazo}
                onChange={(e) => setFormData({ ...formData, prazo: Number(e.target.value) })}
                required
              />
            </div>
          </div>
          <DialogFooter className='mt-6'>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">{contract ? 'Salvar Alterações' : 'Cadastrar Contrato'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
