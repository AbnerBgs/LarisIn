import { prisma } from "@/lib/prisma";

// Batas panjang gambarUrl (data URL hasil kompresi klien jauh di bawah ini).
// Melindungi kolom TEXT di DB agar tidak membengkak oleh payload sembarangan.
export const MAX_GAMBAR_URL_LENGTH = 400_000;

// Ambil (atau buat bila belum ada) kategori milik user berdasarkan nama.
// Dipakai bersama oleh POST /api/product dan PUT /api/product/[id].
export async function resolveKategoriId(userId: string, nama: string) {
  const categoryRecord = await prisma.kategori.upsert({
    where: {
      userId_nama: { userId, nama },
    },
    update: {},
    create: { userId, nama },
  });
  return categoryRecord.id;
}

// GET — produk milik satu user (scope dari sesi Clerk).
export async function getProduk(userId: string) {
  const produk = await prisma.produk.findMany({
    where: { userId },
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

// POST — buat produk milik satu user.
export async function createProduk(
  userId: string,
  data: {
    nama: string;
    harga: number;
    stok: number;
    deskripsi?: string;
    gambarUrl?: string;
    kategoriId?: string;
  },
) {
  const payload: {
    userId: string;
    nama: string;
    harga: number;
    stok: number;
    deskripsi: string | null;
    gambarUrl: string | null;
    kategoriId?: string;
  } = {
    userId,
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
