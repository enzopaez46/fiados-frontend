'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="container mx-auto py-8 px-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fiados App</h1>
        <p className="text-gray-600 mt-2">Frontend conectado</p>
      </div>
      <div className="mt-6">
        <Button onClick={() => router.push("/customers")}>Customers</Button>
      </div>
    </main>
  );
}
