import { ContractsTable } from '@/components/tables/ContractsTable'
import { CustomLinkCard } from '@/components/CustomLinkCard'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { ContractFormDialog } from '@/components/dialogs/ContractFormDialog'
import { useState } from 'react'

export const Route = createFileRoute('/contracts')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
        <h1 className="text-4xl font-bold">Gerenciamento de Contratos</h1>
        <p className="text-lg text-slate-700">
          Aqui você pode gerenciar os contratos do sistema. Adicione, edite ou
          remova contratos conforme necessário.
        </p>
        <CustomLinkCard
          icon={<Plus className="w-12 h-12 text-green-500" />}
          title="Novo Contrato"
          desc="Crie um novo contrato no sistema."
          onClick={() => setIsDialogOpen(true)}
        />
      </div>
      <div className="bg-white flex flex-col justify-center mt-8 rounded-lg p-4 shadow-md w-[80%] mx-auto">
        <ContractsTable />
      </div>
      <ContractFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
