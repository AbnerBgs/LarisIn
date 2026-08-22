import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
import Navbar from "@/components/dashboard/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LarisIn",
  description: "Dashboard penjualan LarisIn",
};
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <SignIn routing="hash" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}