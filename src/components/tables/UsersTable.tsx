import { Button } from '../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Edit, Trash2 } from 'lucide-react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { useMemo, useState, useEffect } from 'react'
import { UserFormDialog } from '../dialogs/UserFormDialog'
import { User } from '@/user/types'

interface UsersTableProps {
  onEdit?: (user: User) => void
  onDelete?: (id: number) => void
  initialData?: User[]
  onDataChange?: (data: User[]) => void
}

export function UsersTable({ onEdit, onDelete, initialData = [], onDataChange }: UsersTableProps = {}) {
  const [data, setData] = useState<User[]>([
    ...initialData,
  ])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    setData([
      ...initialData,
    ])
  }, [initialData])

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleSave = (updatedUser: Partial<User>) => {
    if (onEdit && updatedUser.id) {
      onEdit(updatedUser as User)
    } else if (updatedUser.id) {
      // TODO: Integrar com API - PUT /users/:id
      console.log('Salvar usuário:', updatedUser)
      const newData = data.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u)
      setData(newData)
      if (onDataChange) {
        onDataChange(newData.filter(u => u.id !== 1))
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      if (onDelete) {
        onDelete(id)
      } else {
        // TODO: Integrar com API - DELETE /users/:id
        console.log('Excluir usuário ID:', id)
        const newData = data.filter(u => u.id !== id)
        setData(newData)
        if (onDataChange) {
          onDataChange(newData.filter(u => u.id !== 1)) // Remove exemplo do callback
        }
      }
    }
  }

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: 'Nome',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'perfil',
        header: 'Perfil',
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

      <UserFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={editingUser}
        onSave={handleSave}
      />
    </>
  )
}
