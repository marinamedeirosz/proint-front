import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { useMemo, useState, useEffect } from 'react'
import { SalesFormDialog } from '../dialogs/SalesFormDialog'
import { Sale } from "@/sale/types";

interface SalesTableProps {
  onEdit?: (sale: Partial<Sale> & { id: number }) => void
  onDelete?: (id: number) => void
  initialData?: Sale[]
}

export function SalesTable ({ onEdit, onDelete, initialData = [] }: SalesTableProps = {}) {
  const [data, setData] = useState<Sale[]>([
    ...initialData,
  ])
  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    setData([
      ...initialData,
    ])
  }, [initialData])

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale)
    setIsEditDialogOpen(true)
  }

  const handleSave = (updatedSale: Partial<Sale>) => {
    if (onEdit && editingSale) {
      onEdit({ ...updatedSale, id: editingSale.id })
      setIsEditDialogOpen(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja cancelar esta venda?')) {
      if (onDelete) {
        onDelete(id)
      }
    }
  }

  const columns = useMemo<ColumnDef<Sale>[]>(
    () => [
      {
        accessorKey: 'cliente.nome',
        header: 'Cliente',
        cell: ({ row }) => row.original.cliente?.nome || '-',
      },
      {
        accessorKey: 'tipo_contrato.nome',
        header: 'Tipo do Contrato',
        cell: ({ row }) => row.original.tipo_contrato?.nome || '-',
      },
      {
        accessorKey: 'valor',
        header: 'Valor',
        cell: ({ getValue }) => {
          const value = getValue() as string
          return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
        },
      },
      {
        accessorKey: 'data',
        header: 'Data',
        cell: ({ getValue }) => {
          const date = getValue() as string
          return date ? new Date(date).toLocaleDateString('pt-BR') : '-'
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue() as string
          const statusMap: Record<string, string> = {
            'CRIADA': 'Criada',
            'ATIVA': 'Ativa',
            'QUITADA': 'Quitada',
            'CANCELADA': 'Cancelada',
          }
          return statusMap[status] || status
        },
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
              Cancelar
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

    <SalesFormDialog
      open={isEditDialogOpen}
      onOpenChange={setIsEditDialogOpen}
      sale={editingSale}
      onSave={handleSave}
    />
    </>
  )
}