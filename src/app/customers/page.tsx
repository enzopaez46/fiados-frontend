"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getCustomers } from "@/services/customers";
import { CustomerData } from "@/interfaces/customer";
import CustomersTable from "@/components/customers-table";
import { TableSkeleton } from "@/components/lib/table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err: any) {
        if (err.message === "Unauthorized") {
          logout();
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, [isAuthenticated, router, logout]);

  if (!isAuthenticated) return null;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="flex min-h-screen mx-4 md:mx-6 lg:mx-10 my-8">
        <div className="flex-grow w-full">
          <Card>
            <CardHeader>
              <CardTitle>Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <TableSkeleton columns={6} rows={10} />}
              {!loading && (
                <CustomersTable
                  customers={customers}
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
