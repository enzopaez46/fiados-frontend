import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import NotistackProvider from "@/providers/notistack";
import QueryProvider from "@/providers/query";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fiados App",
  description: "Hoy no se fia, mañana sí",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <QueryProvider>
            <NotistackProvider>{children}</NotistackProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
