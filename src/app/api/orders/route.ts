import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUser, getSessionUserId, unauthorized } from "@/lib/user";

type OrderItemInput = {
  productId?: string | null;
  productName?: string;
  price?: number;
  quantity?: number;
};

// GET: riwayat penjualan milik user yang sedang login.
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const sales = await prisma.penjualan.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    return NextResponse.json({
      sales: sales.map((sale) => ({
        orderId: sale.orderNumber,
        date: sale.createdAt.toISOString().slice(0, 10),
        cashierName: sale.cashierName,
        total: sale.total,
        paymentMethod: sale.paymentType,
      })),
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data penjualan" },
      { status: 500 },
    );
  }
}

// POST: simpan penjualan baru milik user yang sedang login.
// Stok produk otomatis berkurang sesuai jumlah item yang terjual.
export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const body = await request.json();
    const {
      cashierName,
      paymentType,
      orderNumber,
      items,
    }: {
      cashierName?: string;
      paymentType?: string;
      orderNumber?: string;
      items?: OrderItemInput[];
    } = body;

    if (
      !cashierName ||
      !paymentType ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Data pesanan tidak lengkap" },
        { status: 400 },
      );
    }

    await ensureUser(userId);

    const total = items.reduce(
      (sum: number, item: OrderItemInput) =>
        sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );

    const sale = await prisma.$transaction(async (tx) => {
      // 1. Simpan penjualan + item-itemnya
      const created = await tx.penjualan.create({
        data: {
          userId,
          orderNumber: orderNumber || `ORD-${Date.now()}`,
          cashierName: String(cashierName),
          paymentType: String(paymentType),
          total,
          items: {
            create: items.map((item: OrderItemInput) => ({
              productName: String(item.productName || "Produk"),
              price: Number(item.price || 0),
              quantity: Number(item.quantity || 0),
              produkId: item.productId || null,
            })),
          },
        },
        include: { items: true },
      });

      // 2. Kurangi stok produk yang terjual (jangan sampai negatif).
      //    Produk milik user lain tidak mungkin tersentuh karena
      //    filter produkId + userId.
      for (const item of items) {
        if (!item.productId) continue;
        const qty = Number(item.quantity || 0);
        if (qty <= 0) continue;
        await tx.produk.updateMany({
          where: { id: String(item.productId), userId, stok: { gte: qty } },
          data: { stok: { decrement: qty } },
        });
      }

      return created;
    });

    return NextResponse.json({
      success: true,
      orderNumber: sale.orderNumber,
      total: sale.total,
    });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pesanan" },
      { status: 500 },
    );
  }
}

// DELETE: hapus transaksi milik user yang sedang login.
export async function DELETE(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order ID wajib diisi" },
        { status: 400 },
      );
    }

    const result = await prisma.penjualan.deleteMany({
      where: { orderNumber, userId },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/orders error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus transaksi" },
      { status: 500 },
    );
  }
}
