import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export function SalesTable () {
    return (
        <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Tipo do Contrato</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>João Silva</TableCell>
          <TableCell>Consignado INSS 84x</TableCell>
          <TableCell>R$ 5.400,00</TableCell>
          <TableCell>01/01/2024</TableCell>
          <TableCell>Ativo</TableCell>
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