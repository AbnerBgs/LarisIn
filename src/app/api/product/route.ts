import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ensureUser, getSessionUserId, unauthorized } from "@/lib/user";
import { MAX_GAMBAR_URL_LENGTH, resolveKategoriId } from "@/lib/produk";

// POST: tambah produk milik user yang sedang login.
export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const body = await request.json();

    if (!body.nama || !body.nama.trim()) {
      return NextResponse.json(
        { error: "Nama produk wajib diisi" },
        { status: 400 },
      );
    }

    // Gambar sudah dikompresi di klien; tolak payload yang terlalu besar.
    if (
      typeof body.gambarUrl === "string" &&
      body.gambarUrl.length > MAX_GAMBAR_URL_LENGTH
    ) {
      return NextResponse.json(
        { error: "Ukuran gambar terlalu besar" },
        { status: 400 },
      );
    }

    await ensureUser(userId);

    let kategoriId = null;
    if (body.kategori) {
      kategoriId = await resolveKategoriId(userId, String(body.kategori));
    }

    const newProduct = await prisma.produk.create({
      data: {
        userId,
        nama: String(body.nama).trim(),
        harga: Number(body.harga) || 0,
        stok: Number(body.stok) || 0,
        deskripsi: body.deskripsi || null,
        gambarUrl: body.gambarUrl || null,
        ...(kategoriId && { kategoriId }),
      },
      include: { kategori: true },
    });

    revalidatePath("/product");

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST /api/product error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan produk ke DB", details: String(error) },
      { status: 500 },
    );
  }
}

// GET: produk milik user yang sedang login.
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const products = await prisma.produk.findMany({
      where: { userId },
      include: { kategori: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET /api/product error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data produk", details: String(error) },
      { status: 500 },
    );
  }
}
