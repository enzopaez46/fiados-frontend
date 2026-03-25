"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

function CustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // Initialize filters from the url
  const initialFilters: CustomerFilters = {
    name: searchParams.get("name") ?? "",
    active: searchParams.get("active") === "false" ? false : true,
    page:
      Number(searchParams.get("page")) > 0
        ? Number(searchParams.get("page"))
        : 1,
  };
  // Local state for filters
  const [filters, setFilters] = useState<CustomerFilters>(initialFilters);

  const debouncedName = useDebounce(filters.name ?? "", 500);
  const queryFilters = useMemo(
    () => ({
      ...filters,
      name: debouncedName,
    }),
    [filters, debouncedName],
  );
  const queryString = useMemo(
    () => queryStringParser(queryFilters),
    [queryFilters],
  );

  const { customers, pagination, isPending, isError } =
    useAllCustomers(queryFilters);

  // Sincronize url after debounce
  useEffect(() => {
    router.replace(`?${queryString}`);
  }, [queryString, router]);

  const currentPage = pagination?.page ?? filters.page ?? 1;
  const totalPages = pagination?.total_pages ?? 1;
  const visiblePages = getVisiblePages(currentPage, totalPages);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

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
                    setFilters((prev) => ({
                      ...prev,
                      name: e.target.value,
                      page: 1,
                    }))
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
                      page: 1,
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

              {!isPending && totalPages > 1 && (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!pagination?.has_previous}
                        />
                      </PaginationItem>

                      {visiblePages.map((page, index) => (
                        <PaginationItem key={`${page}-${index}`}>
                          {page === "ellipsis" ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              isActive={page === currentPage}
                              onClick={() => handlePageChange(page)}
                              size={"sm"}
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!pagination?.has_next}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomersPage />
    </Suspense>
  );
}
