import { CustomLinkCard } from '@/components/CustomLinkCard'
import { SalesFormDialog } from '@/components/dialogs/SalesFormDialog'
import { SalesTable } from '@/components/tables/SalesTable'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/sales')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [sales, setSales] = useState<any[]>(() => {
    const saved = localStorage.getItem('sales')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales))
  }, [sales])

  const handleCreate = (sale: any) => {
    // TODO: Integrar com API - POST /sales
    const newSale = { ...sale, id: Date.now() }
    setSales([...sales, newSale])
    console.log('Criar venda:', newSale)
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
        <h1 className="text-4xl font-bold">Gerenciamento de Vendas</h1>
        <p className="text-lg text-slate-700">
          Aqui você pode gerenciar as vendas do sistema. Adicione, edite ou
          remova vendas conforme necessário.
        </p>
        <CustomLinkCard
          icon={<Plus className="w-12 h-12 text-green-500" />}
          title="Nova Venda"
          desc="Crie uma nova venda no sistema."
          onClick={() => setIsDialogOpen(true)}
        />
      </div>
      <div className="bg-white flex flex-col justify-center mt-8 rounded-lg p-4 shadow-md w-[80%] mx-auto">
        <SalesTable 
          initialData={sales}
          onDataChange={setSales}
        />
      </div>
      <SalesFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={handleCreate}
      />
    </div>
  )
}
