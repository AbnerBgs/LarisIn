import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUser, getSessionUserId, unauthorized } from "@/lib/user";

// Format kolom DATE (Date lokal midnight) kembali menjadi "yyyy-mm-dd"
// tanpa bergeser lintas zona waktu.
function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toFinanceTx(t: {
  id: string;
  type: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  note: string | null;
}) {
  return {
    id: t.id,
    type: t.type,
    description: t.description,
    amount: t.amount,
    category: t.category,
    date: toISODate(t.date),
    note: t.note ?? undefined,
  };
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// GET: transaksi keuangan milik user yang sedang login.
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const transactions = await prisma.transaksiKeuangan.findMany({
      where: { userId },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      transactions: transactions.map(toFinanceTx),
    });
  } catch (error) {
    console.error("GET /api/finance error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data transaksi keuangan" },
      { status: 500 },
    );
  }
}

// POST: catat transaksi keuangan baru milik user yang sedang login.
export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const body = await request.json();
    const { type, description, amount, category, date, note } = body;

    if (type !== "income" && type !== "expense") {
      return NextResponse.json(
        { error: "Jenis transaksi tidak valid" },
        { status: 400 },
      );
    }
    if (!description || !String(description).trim()) {
      return NextResponse.json(
        { error: "Deskripsi wajib diisi" },
        { status: 400 },
      );
    }
    const amountNum = Number(amount);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { error: "Jumlah harus lebih dari 0" },
        { status: 400 },
      );
    }
    if (!category) {
      return NextResponse.json(
        { error: "Kategori wajib diisi" },
        { status: 400 },
      );
    }
    if (!date || !ISO_DATE_RE.test(String(date))) {
      return NextResponse.json(
        { error: "Tanggal tidak valid (format yyyy-mm-dd)" },
        { status: 400 },
      );
    }

    await ensureUser(userId);

    const created = await prisma.transaksiKeuangan.create({
      data: {
        userId,
        type,
        description: String(description).trim(),
        amount: Math.round(amountNum),
        category: String(category),
        // UTC midnight → kolom DATE menyimpan tanggal yang sama di semua zona waktu
        date: `${date}T00:00:00.000Z`,
        note: note ? String(note) : null,
      },
    });

    return NextResponse.json(
      { success: true, transaction: toFinanceTx(created) },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/finance error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan transaksi keuangan" },
      { status: 500 },
    );
  }
}
