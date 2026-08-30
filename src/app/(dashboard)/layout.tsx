import Navbar from "@/components/dashboard/navbar";
import TopbarDashboard from "@/components/dashboard/topbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard penjualan LarisIn",
};
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 min-w-0">
        <TopbarDashboard />
        {children}
      </div>
    </div>
  );
}
