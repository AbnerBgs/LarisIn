import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET (PUBLIK): daftar UMKM untuk direktori /cek-umkm.
// Hanya profil yang sudah dipublikasikan (isPublished) yang muncul.
// Produk katalog dihubungkan ke profil lewat userId (pemilik).
export async function GET() {
  try {
    const profiles = await prisma.umkmProfile.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: "desc" },
    });

    const userIds = profiles.map((p) => p.userId);
    const products = await prisma.produk.findMany({
      where: { userId: { in: userIds } },
      select: { id: true, userId: true, nama: true, harga: true, gambarUrl: true },
      orderBy: { createdAt: "asc" },
    });

    const productsByUser = new Map<string, typeof products>();
    for (const product of products) {
      const list = productsByUser.get(product.userId) ?? [];
      list.push(product);
      productsByUser.set(product.userId, list);
    }

    const umkmList = profiles.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category || "jasa",
      city: p.city || "",
      area: [p.street, p.district].filter(Boolean).join(", ") || p.city || "",
      rating: 5.0,
      openHours: p.openHours || "",
      whatsapp: p.whatsapp || "",
      description: p.description || "",
      products: (productsByUser.get(p.userId) ?? []).map((pr) => ({
        id: pr.id,
        name: pr.nama,
        price: pr.harga,
        imageUrl: pr.gambarUrl ?? "",
      })),
      jobs: (p.jobsText ?? "")
        .split(/\n|,/)
        .map((line) => line.trim())
        .filter((line) => line !== "")
        .map((title) => ({
          title,
          type: "Penuh Waktu",
          salary: "Kompetitif",
        })),
    }));

    return NextResponse.json(umkmList);
  } catch (error) {
    console.error("GET /api/umkm error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data UMKM" },
      { status: 500 },
    );
  }
}
