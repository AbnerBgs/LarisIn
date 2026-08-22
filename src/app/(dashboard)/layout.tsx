import type { Metadata } from "next";
import Navbar from "@/components/dashboard/navbar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard penjualan LarisIn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
