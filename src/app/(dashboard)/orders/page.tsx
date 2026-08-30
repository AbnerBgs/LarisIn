import { getProduk } from "@/lib/produk";
import OrdersForm from "./orders-form";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const products = await getProduk();

  return <OrdersForm products={products} />;
}
