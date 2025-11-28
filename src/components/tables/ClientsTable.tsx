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

export function ClientsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>Endereço</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Maria Oliveira</TableCell>
          <TableCell>123.456.789-00</TableCell>
          <TableCell>Rua das Flores, 123</TableCell>
          <TableCell>(11) 91234-5678</TableCell>
          <TableCell>maria.oliveira@example.com</TableCell>
          <TableCell className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 cursor-pointer"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
