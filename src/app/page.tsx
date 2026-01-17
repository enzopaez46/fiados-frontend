"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Topbar } from "@/components/lib/topbar";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.push("/customers");
    } else {
      router.push("/login");
    }
  }, []);
  return (
    <main>
      <Topbar />
    </main>
  );
}
