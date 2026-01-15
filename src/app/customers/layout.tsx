import { Topbar } from "@/components/lib/topbar";

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Topbar />
      {children}
    </div>
  );
}
