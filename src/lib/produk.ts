import { prisma } from "@/lib/prisma";
import type { Product } from "@/app/(dashboard)/orders/product";

export async function getProduk(): Promise<Product[]> {
  const produk = await prisma.produk.findMany({
    include: { kategori: true },
    orderBy: { nama: "asc" },
  });

  return produk.map((p) => ({
    id: p.id,
    name: p.nama,
    price: p.harga,
    image: p.gambarUrl ?? "",
    description: p.deskripsi ?? "",
    category: p.kategori.nama,
    stock: p.stok,
  }));
}
