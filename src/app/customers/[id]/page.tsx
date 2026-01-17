"use client";

import { useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

import {
  useCustomer,
  useCustomerTransactions,
  useCreateTransaction,
} from "@/hooks/customers";

import { useSnackbar } from "notistack";

import { TransactionType } from "@/interfaces/transaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionFormData {
  type: TransactionType;
  amount: number;
  description?: string;
}

export default function CustomerDetailPage() {
  const { id } = useParams();
  const customerId = Number(id);

  const {
    customer,
    isLoading: isCustomerLoading,
    isError: isCustomerError,
  } = useCustomer(customerId);
  const {
    transactions,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
  } = useCustomerTransactions(customerId);
  const { createTransaction } = useCreateTransaction(customerId);

  const { enqueueSnackbar } = useSnackbar();

  // react-hook-form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<TransactionFormData>({
    defaultValues: {
      type: "COMPRA",
      amount: undefined,
      description: "",
    },
  });

  async function onSubmit(data: TransactionFormData) {
    try {
      await createTransaction({
        type: data.type,
        amount: data.amount,
        description: data.description || undefined,
      });

      reset();
      enqueueSnackbar("Movimiento creado con éxito", { variant: "success" });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Error al crear el movimiento", {
        variant: "error",
      });
    }
  }

  if (isCustomerLoading || isTransactionsLoading) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
      </main>
    );
  }
  if (isCustomerError || isTransactionsError) return "Error";

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Customer Info */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {customer?.name}
          </h1>
          <p className="text-gray-600 mt-2">Cliente ID: {customerId}</p>
        </div>

        {/* Debt Card */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Deuda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">
              ${customer?.debt.toLocaleString("es-AR")}
            </div>
            <p className="text-gray-600 text-sm mt-2">Deuda actual</p>
          </CardContent>
        </Card>

        {/* New Transaction Form */}
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Movimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Movimiento</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMPRA">Compra</SelectItem>
                        <SelectItem value="PAGO">Pago</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  {...register("amount", {
                    required: "El monto es requerido",
                    valueAsNumber: true,
                    min: { value: 0, message: "El monto debe ser mayor a 0" },
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Input
                  id="description"
                  placeholder="Ej: Detergente, Arroz..."
                  {...register("description")}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Movimiento"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
