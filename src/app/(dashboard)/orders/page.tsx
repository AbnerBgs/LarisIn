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

  const [products, todayServed] = await Promise.all([
    getProduk(userId),
    prisma.penjualan.count({
      where: { userId, createdAt: { gte: todayStart, lt: tomorrowStart } },
    }),
  ]);

  return <OrdersForm products={products} todayServed={todayServed} />;
}
