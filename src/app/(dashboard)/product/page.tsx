// app/produk/page.tsx
import { prisma } from "@/lib/prisma";
import ProdukClient from "./produk-client";

export default async function ProdukPage() {
  const produk = await prisma.produk.findMany({
    include: { kategori: true },
    orderBy: { createdAt: "desc" },
  });

  const products = produk.map((p) => ({
    id: p.id,
    name: p.nama,
    price: p.harga,
    image: p.gambarUrl ?? "https://picsum.photos/200/300",
    description: p.deskripsi ?? "",
    category: p.kategori.nama,
    stock: p.stok,
  }));

  return <ProdukClient products={products} />;
}
