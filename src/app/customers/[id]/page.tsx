"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Edit } from "lucide-react";

import { useCustomer, useCustomerTransactions } from "@/hooks/customers";

import TransactionsTable from "@/components/transactions-table";
import TransactionForm from "@/components/transaction-form";
import CustomerForm from "@/components/customer-form";

import { TableSkeleton } from "@/components/lib/table-skeleton";
import { DrawerComponent } from "@/components/lib/drawer";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SwitchFormType = "NEW_TRANSACTION" | "UPDATE_CUSTOMER";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const customerId = Number(id);

  const [open, setOpen] = useState(false);
  const [switchForm, setSwitchForm] =
    useState<SwitchFormType>("NEW_TRANSACTION");

  const handleDrawer = (formType: SwitchFormType) => {
    setSwitchForm(formType);
    setOpen(true);
  };

  const {
    customer,
    isPending: isCustomerLoading,
    isError: isCustomerError,
  } = useCustomer(customerId);
  const {
    transactions,
    isPending: isTransactionsLoading,
    isError: isTransactionsError,
  } = useCustomerTransactions(customerId);

  if (isCustomerLoading) {
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
          <p className="text-gray-600 mt-2">
            Telefono: {customer?.phonenumber}
          </p>
        </div>
        <div className="space-x-2">
          <Button
            variant={"outline"}
            size={"lg"}
            onClick={() => handleDrawer("NEW_TRANSACTION")}
          >
            <Plus />
            Nuevo Movimiento
          </Button>
          <Button
            variant={"secondary"}
            size={"lg"}
            onClick={() => handleDrawer("UPDATE_CUSTOMER")}
          >
            <Edit />
            Editar Cliente
          </Button>
        </div>

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
        {isTransactionsLoading ? (
          <TableSkeleton columns={4} rows={4} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Movimientos</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsTable transactions={transactions || []} />
            </CardContent>
          </Card>
        )}

        {/* Drawer - New Transaction Form */}
        <DrawerComponent
          open={open}
          onClose={() => setOpen(false)}
          title={
            switchForm === "NEW_TRANSACTION"
              ? "Nuevo Movimiento"
              : "Editar Cliente"
          }
          description={switchForm === "NEW_TRANSACTION" ? customer?.name : ""}
        >
          {switchForm === "NEW_TRANSACTION" ? (
            <TransactionForm
              customerId={customerId}
              onClose={() => setOpen(false)}
            />
          ) : (
            <CustomerForm
              customerId={customerId}
              initial={{
                name: customer?.name || "",
                phonenumber: customer?.phonenumber || "",
                active: customer?.active || true,
              }}
              onClose={() => setOpen(false)}
            />
          )}
        </DrawerComponent>
      </div>
    </main>
  );
}
