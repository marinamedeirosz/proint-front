import { Edit, LucideCirclePower, Trash2 } from 'lucide-react'
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
  onEdit?: (contract: Partial<Contract> & { id: string | number }) => void
  onDelete?: (id: string | number) => void
  initialData?: Contract[]
}

export function ContractsTable({ onEdit, onDelete, initialData = [] }: ContractsTableProps = {}) {
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
    if (onEdit && editingContract) {
      onEdit({ ...updatedContract, id: editingContract.id })
      setIsEditDialogOpen(false)
    }
  }

  const handleDelete = async (id: string | number) => {
    if (confirm('Tem certeza que deseja desativar este contrato?')) {
      if (onDelete) {
        onDelete(id)
      }
    }
  }

  const columns = useMemo<ColumnDef<Contract>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: 'Nome do Contrato',
      },
      {
        accessorKey: 'prazo_meses',
        header: 'Prazo (meses)',
      },
      {
        accessorKey: 'tempo_nova_oportunidade_dias',
        header: 'Nova Oportunidade (dias)',
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
              <LucideCirclePower className="h-4 w-4" />
              Desativar
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
