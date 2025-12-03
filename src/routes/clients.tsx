import { ClientsTable } from '@/components/tables/ClientsTable'
import { CustomLinkCard } from '@/components/CustomLinkCard'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { ClientFormDialog } from '@/components/dialogs/ClientFormDialog'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/clients')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [clients, setClients] = useState<any[]>(() => {
    const saved = localStorage.getItem('clients')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients))
  }, [clients])

  const handleCreate = (client: any) => {
    // TODO: Integrar com API - POST /clients
    const newClient = { ...client, id: Date.now(), ativo: true }
    setClients([...clients, newClient])
    console.log('Criar cliente:', newClient)
    setIsDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-200 via-slate-300 to-slate-400 p-8">
      <Link to="/" className="inline-block mb-4">
        <Button
          variant={'outline'}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </Link>
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold">Gerenciamento de Clientes</h1>
        <p className="text-lg text-slate-700">
          Aqui você pode gerenciar os clientes do sistema. Adicione, edite ou
          remova clientes conforme necessário.
        </p>
        <CustomLinkCard
          icon={<Plus className="w-12 h-12 text-green-500" />}
          title="Cadastrar Cliente"
          desc="Adicione um novo cliente ao sistema."
          onClick={() => setIsDialogOpen(true)}
        />
      </div>
      <div className='bg-white rounded-lg shadow-md p-6 mt-8 w-[80%] mx-auto'>
        <ClientsTable 
          initialData={clients}
          onDataChange={setClients}
        />
       </div>
      
      <ClientFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={handleCreate}
      />
    </div>
  )
}
