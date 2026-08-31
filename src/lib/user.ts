// Helper sesi & sinkronisasi user Clerk ke database.
// User dibuat malas (lazy): baris `User` pertama kali muncul saat
// request pertama user yang sudah login (tanpa perlu webhook).

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Ambil userId dari sesi Clerk. `null` jika belum login. */
export async function getSessionUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}

/** Pastikan baris User ada di DB untuk userId Clerk ini. */
export async function ensureUser(userId: string) {
  return prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });
}

/** Ambil profil UMKM milik user; buat placeholder bila belum ada. */
export async function getOrCreateProfile(userId: string) {
  await ensureUser(userId);
  const existing = await prisma.umkmProfile.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.umkmProfile.create({
    data: { userId, name: "Nama Usaha" },
  });
}

/** Response 401 standar untuk endpoint yang butuh login. */
export function unauthorized() {
  return NextResponse.json({ error: "Harus login terlebih dahulu" }, { status: 401 });
}
