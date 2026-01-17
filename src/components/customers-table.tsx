"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomerData } from "@/interfaces/customer";

interface CustomersTableProps {
  customers: CustomerData[];
  onClickItem?: (id: number) => void;
}

export default function CustomersTable({
  customers,
  onClickItem,
}: CustomersTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Deuda</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer.id}
              onClick={() => onClickItem?.(customer.id)}
              className="cursor-pointer"
            >
              <TableCell>{customer.name}</TableCell>
              <TableCell
                className={`font-semibold ${customer && customer?.debt > 0 ? "text-red-600" : "text-green-600"}`}
              >
                ${customer?.debt.toLocaleString("es-AR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
