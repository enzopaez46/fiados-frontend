"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Plus, Edit } from "lucide-react";

import { useCustomer, useCustomerTransactions, type TransactionFilters } from "@/hooks/customers";

import TransactionsTable from "@/components/transactions-table";
import TransactionForm from "@/components/transaction-form";
import CustomerForm from "@/components/customer-form";

import { TableSkeleton } from "@/components/lib/table-skeleton";
import { DrawerComponent } from "@/components/lib/drawer";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type SwitchFormType = "NEW_TRANSACTION" | "UPDATE_CUSTOMER";

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages] as const;
  }

  return [
    1,
    "ellipsis",
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ] as const;
}

export default function CustomerDetailPage() {
  const { id } = useParams();
  const customerId = Number(id);

  const [open, setOpen] = useState(false);
  const [switchForm, setSwitchForm] =
    useState<SwitchFormType>("NEW_TRANSACTION");
  const [transactionPage, setTransactionPage] = useState(1);

  const transactionFilters: TransactionFilters = useMemo(
    () => ({
      page: transactionPage,
    }),
    [transactionPage]
  );

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
    pagination,
    isPending: isTransactionsLoading,
    isError: isTransactionsError,
  } = useCustomerTransactions(customerId, transactionFilters);

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

              {pagination && pagination.total_pages > 1 && (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setTransactionPage((p) => Math.max(p - 1, 1))
                          }
                          disabled={!pagination.has_previous}
                        />
                      </PaginationItem>

                      {getVisiblePages(
                        pagination.page,
                        pagination.total_pages
                      ).map((page, index) => (
                        <PaginationItem key={`${page}-${index}`}>
                          {page === "ellipsis" ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              isActive={page === pagination.page}
                              onClick={() => setTransactionPage(page)}
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setTransactionPage((p) =>
                              Math.min(p + 1, pagination.total_pages)
                            )
                          }
                          disabled={!pagination.has_next}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
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
