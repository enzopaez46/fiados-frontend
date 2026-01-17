"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAllCustomers } from "@/hooks/customers";

import CustomersTable from "@/components/customers-table";
import CustomerForm from "@/components/customer-form";

import { Plus } from "lucide-react";
import { DrawerComponent } from "@/components/lib/drawer";
import { TableSkeleton } from "@/components/lib/table-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { customers, isLoading, isError } = useAllCustomers();

  if (isError) return <p>Error: {isError}</p>;

  return (
    <>
      <div className="flex min-h-screen mx-4 md:mx-6 lg:mx-10 my-8">
        <div className="flex-grow w-full">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Clientes</CardTitle>
              <Button variant={"outline"} onClick={() => setOpen(true)}>
                <Plus />
                Nuevo Cliente
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading && <TableSkeleton columns={6} rows={10} />}
              {!isLoading && (
                <CustomersTable
                  customers={customers ? customers : []}
                  onClickItem={(id) => router.push(`/customers/${id}/`)}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Drawer - New Customer Form */}
      <DrawerComponent
        open={open}
        onClose={() => setOpen(false)}
        title="Nuevo Cliente"
      >
        <CustomerForm onClose={() => setOpen(false)} />
      </DrawerComponent>
    </>
  );
}
