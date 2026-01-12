import type { Metadata } from "next";
import { AuthProvider } from "@/src/contexts/AuthContext";
//import "./globals.css";

export const metadata: Metadata = {
  title: "Fiados App",
  description: "Hoy no se fia, mañana sí",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
