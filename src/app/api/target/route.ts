import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUser, getSessionUserId, unauthorized } from "@/lib/user";

// GET: target pendapatan bulanan milik user yang sedang login.
// Mengembalikan amount 0 bila belum pernah diatur.
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const target = await prisma.targetPendapatan.findUnique({
      where: { userId },
    });

    return NextResponse.json({ amount: target?.amount ?? 0 });
  } catch (error) {
    console.error("GET /api/target error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil target pendapatan" },
      { status: 500 },
    );
  }
}

// PUT: atur/ubah target pendapatan bulanan milik user yang sedang login.
export async function PUT(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const body = await request.json();
    const amount = Number(body.amount);

    if (Number.isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { error: "Target harus berupa angka 0 atau lebih" },
        { status: 400 },
      );
    }

    await ensureUser(userId);

    const target = await prisma.targetPendapatan.upsert({
      where: { userId },
      update: { amount: Math.round(amount) },
      create: { userId, amount: Math.round(amount) },
    });

    return NextResponse.json({ amount: target.amount });
  } catch (error) {
    console.error("PUT /api/target error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan target pendapatan" },
      { status: 500 },
    );
  }
}
