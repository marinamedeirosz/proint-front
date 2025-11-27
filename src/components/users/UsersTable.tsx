import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

export function UsersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Perfil</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>João Silva</TableCell>
          <TableCell>joao.silva@example.com</TableCell>
          <TableCell>Administrador</TableCell>
          <TableCell>Editar | Excluir</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
