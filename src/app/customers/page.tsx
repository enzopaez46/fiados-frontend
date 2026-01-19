"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAllCustomers, CustomerFilters } from "@/hooks/customers";
import { useDebounce } from "@/hooks/debounce";

import queryStringParser from "@/utils/queryStringParser";

import CustomersTable from "@/components/customers-table";
import CustomerForm from "@/components/customer-form";

import { Plus } from "lucide-react";
import { DrawerComponent } from "@/components/lib/drawer";
import { TableSkeleton } from "@/components/lib/table-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // Initialize filters from the url
  const initialFilters: CustomerFilters = {
    name: searchParams.get("name") ?? "",
    active: searchParams.get("active") === "false" ? false : true,
  };
  // Local state for filters
  const [filters, setFilters] = useState<CustomerFilters>(initialFilters);

  const debouncedFilters = useDebounce(filters, 500);

  const { customers, isPending, isError } = useAllCustomers(debouncedFilters);

  // Sincronize url after debounce
  useEffect(() => {
    const queryString = queryStringParser(debouncedFilters);
    router.push(`?${queryString}`);
  }, [debouncedFilters, router]);

  // Synchronize url if changes manually
  useEffect(() => {
    setFilters(initialFilters);
  }, [searchParams]);

  if (isError) return <p>Error</p>;

  return (
    <>
      <div className="flex min-h-screen mx-4 md:mx-6 lg:mx-10 my-8">
        <div className="flex-grow w-full">
          <Card>
            <CardHeader>
              <div className="flex flex-row justify-between items-center">
                <CardTitle>Clientes</CardTitle>
                <Button variant={"outline"} onClick={() => setOpen(true)}>
                  <Plus />
                  Nuevo Cliente
                </Button>
              </div>
              <div className="flex gap-4 mt-2">
                <Input
                  value={filters.name ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Buscar"
                  className="max-w-60"
                />
                <Select
                  value={String(filters.active)}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      active: value === "true",
                    }))
                  }
                >
                  <SelectTrigger className="w-30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activos</SelectItem>
                    <SelectItem value="false">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isPending && <TableSkeleton columns={6} rows={10} />}
              {!isPending && (
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
