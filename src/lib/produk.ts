import { prisma } from "@/lib/prisma";

// GET
export async function getProduk() {
  const produk = await prisma.produk.findMany({
    include: { kategori: true },
    orderBy: { createdAt: "desc" },
  });

  return produk.map((p) => ({
    id: p.id,
    name: p.nama,
    price: p.harga,
    image: p.gambarUrl ?? "https://picsum.photos/200/300",
    description: p.deskripsi ?? "",
    category: p.kategori?.nama ?? "Tanpa Kategori",
    stock: p.stok,
  }));
}

// POST
export async function createProduk(data: {
  nama: string;
  harga: number;
  stok: number;
  deskripsi?: string;
  gambarUrl?: string;
  kategoriId?: string;
}) {
  const payload: any = {
    nama: data.nama,
    harga: Number(data.harga),
    stok: Number(data.stok),
    deskripsi: data.deskripsi || null,
    gambarUrl: data.gambarUrl || null,
  };

  if (data.kategoriId && data.kategoriId.trim() !== "") {
    payload.kategoriId = data.kategoriId;
  }

  return await prisma.produk.create({
    data: payload,
  });
}