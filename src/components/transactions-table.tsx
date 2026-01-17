"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TransactionData } from "@/interfaces/transaction";

interface TransactionsTableProps {
  transactions: TransactionData[];
}

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    tx.type === "COMPRA"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {tx.type}
                </span>
              </TableCell>
              <TableCell className="font-semibold">
                ${tx.amount.toLocaleString("es-AR")}
              </TableCell>
              <TableCell className="text-gray-600">
                {tx.description || "—"}
              </TableCell>
              <TableCell className="text-right text-sm text-gray-500">
                {new Date(tx.timestamp || "").toLocaleDateString("es-AR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
