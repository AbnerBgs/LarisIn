import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProduk } from "@/lib/produk";
import { prisma } from "@/lib/prisma";
import OrdersForm from "./orders-form";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Penghitung pelanggan yang sudah dilayani kasir hari ini —
  // sumber data "Total Pengunjung" di halaman Dashboard.
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const [products, todayServed, profile] = await Promise.all([
    getProduk(userId),
    prisma.penjualan.count({
      where: { userId, createdAt: { gte: todayStart, lt: tomorrowStart } },
    }),
    prisma.umkmProfile.findUnique({
      where: { userId },
      select: { name: true },
    }),
  ]);

  return (
    <OrdersForm
      products={products}
      todayServed={todayServed}
      businessName={profile?.name}
    />
  );
}
