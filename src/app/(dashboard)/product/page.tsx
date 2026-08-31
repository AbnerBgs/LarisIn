import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"; // Sesuaikan path prisma client kamu
import ProdukClient from "./produk-client";

export const revalidate = 0; // Memastikan data selalu segar / tidak di-cache

export default async function ProductPage() {
  const { userId } = await auth();

  // 1. Ambil data produk milik user yang sedang login
  const products = userId
    ? await prisma.produk.findMany({
        where: { userId },
        include: { kategori: true },
        orderBy: {
          createdAt: "desc", // Produk terbaru di atas
        },
      })
    : [];

  return (
    <ProdukClient
      products={products.map((p) => ({
        id: p.id,
        name: p.nama,
        price: p.harga,
        // null = tanpa gambar → ProdukClient menampilkan ikon kategori.
        image: p.gambarUrl,
        description: p.deskripsi ?? "",
        category: p.kategori?.nama ?? "Tanpa Kategori",
        stock: p.stok,
      }))}
    />
  );
}
