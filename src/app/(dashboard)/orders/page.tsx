import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProduk } from "@/lib/produk";
import OrdersForm from "./orders-form";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const products = await getProduk(userId);

  return <OrdersForm products={products} />;
}
