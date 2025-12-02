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
import { ClientFormDialog } from '../dialogs/ClientFormDialog'
import { Client } from '@/client/types'

interface ClientsTableProps {
  onEdit?: (client: Client) => void
  onDelete?: (id: number) => void
  initialData?: Client[]
  onDataChange?: (data: Client[]) => void
}

export function ClientsTable({ onEdit, onDelete, initialData = [], onDataChange }: ClientsTableProps = {}) {
  const [data, setData] = useState<Client[]>([
    ...initialData
  ])
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    setData([
      ...initialData,
    ])
  }, [initialData])

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setIsEditDialogOpen(true)
  }

  const handleSave = (updatedClient: Partial<Client>) => {
    if (onEdit && updatedClient.id) {
      onEdit(updatedClient as Client)
    } else if (updatedClient.id) {
      // TODO: Integrar com API - PUT /clients/:id
      console.log('Salvar cliente:', updatedClient)
      const newData = data.map(c => c.id === updatedClient.id ? { ...c, ...updatedClient } : c)
      setData(newData)
      if (onDataChange) {
        onDataChange(newData.filter(c => c.id !== 1))
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      if (onDelete) {
        onDelete(id)
      } else {
        // TODO: Integrar com API - DELETE /clients/:id
        console.log('Excluir cliente ID:', id)
        const newData = data.filter(client => client.id !== id)
        setData(newData)
        if (onDataChange) {
          onDataChange(newData.filter(c => c.id !== 1)) // Remove exemplo do callback
        }
      }
    }
  }

  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: 'Nome',
      },
      {
        accessorKey: 'cpf',
        header: 'CPF',
      },
      {
        accessorKey: 'endereco',
        header: 'Endereço',
      },
      {
        accessorKey: 'telefone',
        header: 'Telefone',
      },
      {
        accessorKey: 'email',
        header: 'Email',
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

      <ClientFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        client={editingClient}
        onSave={handleSave}
      />
    </>
  )
}
