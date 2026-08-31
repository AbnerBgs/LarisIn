import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ensureUser, getSessionUserId, unauthorized } from "@/lib/user";
import { MAX_GAMBAR_URL_LENGTH, resolveKategoriId } from "@/lib/produk";

type RouteContext = { params: Promise<{ id: string }> };

// PUT: perbarui produk milik user yang sedang login.
export async function PUT(request: Request, context: RouteContext) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const { id } = await context.params;
    const body = await request.json();

    if (!body.nama || !String(body.nama).trim()) {
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

    // Pastikan produk ada dan milik user ini (mencegah edit produk user lain).
    const existing = await prisma.produk.findFirst({ where: { id, userId } });
    if (!existing) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 },
      );
    }

    await ensureUser(userId);

    let kategoriId: string | null = null;
    if (body.kategori) {
      kategoriId = await resolveKategoriId(userId, String(body.kategori));
    }

    const updated = await prisma.produk.update({
      where: { id },
      data: {
        nama: String(body.nama).trim(),
        harga: Number(body.harga) || 0,
        stok: Number(body.stok) || 0,
        deskripsi: body.deskripsi || null,
        // null = hapus gambar; string = URL/data URL baru atau lama.
        gambarUrl: body.gambarUrl ?? null,
        kategoriId,
      },
      include: { kategori: true },
    });

    revalidatePath("/product");

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/product/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui produk", details: String(error) },
      { status: 500 },
    );
  }
}

// DELETE: hapus produk milik user yang sedang login.
export async function DELETE(_request: Request, context: RouteContext) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const { id } = await context.params;

    // Scope userId memastikan produk user lain tidak bisa dihapus.
    const result = await prisma.produk.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 },
      );
    }

    revalidatePath("/product");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/product/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus produk", details: String(error) },
      { status: 500 },
    );
  }
}
