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

export function ContractsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome do Contrato</TableHead>
          <TableHead>Prazo (meses)</TableHead>
          <TableHead>Nova oportunidade em:</TableHead>
          <TableHead>Ativo</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Consignado INSS 84x"</TableCell>
          <TableCell>84</TableCell>
          <TableCell>540</TableCell>
          <TableCell>Sim</TableCell>
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
