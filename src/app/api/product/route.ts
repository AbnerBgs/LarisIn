import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let kategoriId = null;
    if (body.kategori) {
      const categoryRecord = await prisma.kategori.upsert({
        where: { nama: body.kategori },
        update: {},
        create: { nama: body.kategori },
      });
      kategoriId = categoryRecord.id;
    }

    const newProduct = await prisma.produk.create({
      data: {
        nama: body.nama,
        harga: Number(body.harga),
        stok: Number(body.stok) || 0,
        deskripsi: body.deskripsi || null,
        gambarUrl: body.gambarUrl || "https://picsum.photos/200/300",
        ...(kategoriId && { kategoriId }),
      },
    });

    revalidatePath("/product");

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Prisma Create Error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan produk ke DB", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.produk.findMany();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Prisma Fetch Products Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data produk", details: String(error) },
      { status: 500 }
    );
  }
}