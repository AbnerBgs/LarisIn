import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sales = await prisma.penjualan.findMany({
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cashierName, paymentType, orderNumber, items } = body;

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

    const total = items.reduce(
      (sum: number, item: any) =>
        sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );

    const sale = await prisma.penjualan.create({
      data: {
        orderNumber: orderNumber || `ORD-${Date.now()}`,
        cashierName: String(cashierName),
        paymentType: String(paymentType),
        total,
        items: {
          create: items.map((item: any) => ({
            productName: String(item.productName || "Produk"),
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 0),
            produkId: item.productId || null,
          })),
        },
      },
      include: { items: true },
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order ID wajib diisi" },
        { status: 400 },
      );
    }

    await prisma.penjualan.delete({
      where: { orderNumber },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/orders error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus transaksi" },
      { status: 500 },
    );
  }
}
