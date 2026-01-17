"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";

import { useCustomer, useCustomerTransactions } from "@/hooks/customers";

import TransactionsTable from "@/components/transactions-table";
import TransactionForm from "@/components/transaction-form";

import { DrawerComponent } from "@/components/lib/drawer";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const customerId = Number(id);

  const [open, setOpen] = useState(false);

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
        <Button variant={"outline"} size={"lg"} onClick={() => setOpen(true)}>
          <Plus />
          Nuevo Movimiento
        </Button>

        {/* Debt Card */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Deuda</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-4xl font-bold ${customer && customer?.debt > 0 ? "text-red-600" : "text-green-600"}`}
            >
              ${customer?.debt.toLocaleString("es-AR")}
            </div>
            <p className="text-gray-600 text-sm mt-2">Deuda actual</p>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsTable transactions={transactions || []} />
          </CardContent>
        </Card>

        {/* Drawer - New Transaction Form */}
        <DrawerComponent
          open={open}
          onClose={() => setOpen(false)}
          title="Nuevo Movimiento"
          description={customer?.name}
        >
          <TransactionForm
            customerId={customerId}
            onClose={() => setOpen(false)}
          />
        </DrawerComponent>
      </div>
    </main>
  );
}
