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
import { Client } from '@/client/types'

interface ClientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client | null
  onSave?: (client: Partial<Client>) => void
}

export function ClientFormDialog({
  open,
  onOpenChange,
  client,
  onSave,
}: ClientFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Client>>({
    nome: '',
    cpf: '',
    endereco: '',
    telefone: '',
    email: '',
  })

  useEffect(() => {
    if (client) {
      setFormData(client)
    } else {
      setFormData({
        nome: '',
        cpf: '',
        endereco: '',
        telefone: '',
        email: '',
      })
    }
  }, [client, open])

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
            <DialogTitle>{client ? 'Editar Cliente' : 'Cadastro de Cliente'}</DialogTitle>
            <DialogDescription className='mb-5'>
              {client ? 'Edite as informações do cliente.' : 'Cadastre as informações do cliente no formulário abaixo.'}
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
              <Label htmlFor="cpf">CPF</Label>
              <Input 
                id="cpf" 
                name="cpf" 
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="endereco">Endereço</Label>
              <Input 
                id="endereco" 
                name="endereco" 
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
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
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">{client ? 'Salvar Alterações' : 'Cadastrar Cliente'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
