import { Edit, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { useMemo, useState, useEffect } from 'react'
import { ContractFormDialog } from '../dialogs/ContractFormDialog'
import { Contract } from '@/contract/types'

interface ContractsTableProps {
  onEdit?: (contract: Contract) => void
  onDelete?: (id: number) => void
  initialData?: Contract[]
  onDataChange?: (data: Contract[]) => void
}

export function ContractsTable({ onEdit, onDelete, initialData = [], onDataChange }: ContractsTableProps = {}) {
  const [data, setData] = useState<Contract[]>([
    ...initialData,
  ])
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    setData([
      ...initialData,
    ])
  }, [initialData])

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract)
    setIsEditDialogOpen(true)
  }

  const handleSave = (updatedContract: Partial<Contract>) => {
    if (onEdit && updatedContract.id) {
      onEdit(updatedContract as Contract)
    } else if (updatedContract.id) {
      // TODO: Integrar com API - PUT /contracts/:id
      console.log('Salvar contrato:', updatedContract)
      const newData = data.map(c => c.id === updatedContract.id ? { ...c, ...updatedContract } : c)
      setData(newData)
      if (onDataChange) {
        onDataChange(newData.filter(c => c.id !== 1)) 
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este contrato?')) {
      if (onDelete) {
        onDelete(id)
      } else {
        // TODO: Integrar com API - DELETE /contracts/:id
        console.log('Excluir contrato ID:', id)
        const newData = data.filter(contract => contract.id !== id)
        setData(newData)
        if (onDataChange) {
          onDataChange(newData.filter(c => c.id !== 1)) 
        }
      }
    }
  }

  const columns = useMemo<ColumnDef<Contract>[]>(
    () => [
      {
        accessorKey: 'nomeContrato',
        header: 'Nome do Contrato',
      },
      {
        accessorKey: 'prazo',
        header: 'Prazo (meses)',
      },
      {
        accessorKey: 'novaOportunidade',
        header: 'Nova oportunidade em:',
      },
      {
        accessorKey: 'ativo',
        header: 'Ativo',
        cell: ({ getValue }) => (getValue() ? 'Sim' : 'Não'),
      },
      {
        id: 'actions',
        header: () => <div className="text-center">Ações</div>,
        cell: ({ row }) => (
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => handleEdit(row.original)}
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        ),
      },
    ],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <ContractFormDialog
      open={isEditDialogOpen}
      onOpenChange={setIsEditDialogOpen}
      contract={editingContract}
      onSave={handleSave}
    />
    </>
  )
}
