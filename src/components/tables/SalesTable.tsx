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
  onEdit?: (sale: Sale) => void
  onDelete?: (id: number) => void
  initialData?: Sale[]
  onDataChange?: (data: Sale[]) => void
}

export function SalesTable ({ onEdit, onDelete, initialData = [], onDataChange }: SalesTableProps = {}) {
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
    if (onEdit && updatedSale.id) {
      onEdit(updatedSale as Sale)
    } else if (updatedSale.id) {
      // TODO: Integrar com API - PUT /sales/:id
      console.log('Salvar venda:', updatedSale)
      const newData = data.map(s => s.id === updatedSale.id ? { ...s, ...updatedSale } : s)
      setData(newData)
      if (onDataChange) {
        onDataChange(newData.filter(s => s.id !== 1)) 
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta venda?')) {
      if (onDelete) {
        onDelete(id)
      } else {
        // TODO: Integrar com API - DELETE /sales/:id
        console.log('Excluir venda ID:', id)
        const newData = data.filter(sale => sale.id !== id)
        setData(newData)
        if (onDataChange) {
          onDataChange(newData.filter(s => s.id !== 1)) 
        }
      }
    }
  }

  const columns = useMemo<ColumnDef<Sale>[]>(
    () => [
      {
        accessorKey: 'cliente',
        header: 'Cliente',
      },
      {
        accessorKey: 'tipoContrato',
        header: 'Tipo do Contrato',
      },
      {
        accessorKey: 'valor',
        header: 'Valor',
      },
      {
        accessorKey: 'data',
        header: 'Data',
      },
      {
        accessorKey: 'status',
        header: 'Status',
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

    <SalesFormDialog
      open={isEditDialogOpen}
      onOpenChange={setIsEditDialogOpen}
      sale={editingSale}
      onSave={handleSave}
    />
    </>
  )
}