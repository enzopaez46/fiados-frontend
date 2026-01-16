"use client";

import { useRouter } from "next/navigation";

import { useAllCustomers } from "@/hooks/customers";

import CustomersTable from "@/components/customers-table";
import { TableSkeleton } from "@/components/lib/table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  const router = useRouter();
  const { customers, isLoading, isError } = useAllCustomers();

  if (isError) return <p>Error: {isError}</p>;

  return (
    <>
      <div className="flex min-h-screen mx-4 md:mx-6 lg:mx-10 my-8">
        <div className="flex-grow w-full">
          <Card>
            <CardHeader>
              <CardTitle>Clientes</CardTitle>
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
    </>
  );
}
