import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUser, getSessionUserId, unauthorized } from "@/lib/user";

// GET: profil UMKM milik user yang sedang login (auto-create placeholder).
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    await ensureUser(userId);

    let profile = await prisma.umkmProfile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await prisma.umkmProfile.create({
        data: { userId, name: "Nama Usaha" },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/profileUmkm error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil profil" },
      { status: 500 },
    );
  }
}

// PUT: update profil UMKM milik user yang sedang login.
// Setelah disimpan, profil dipublikasikan ke direktori /cek-umkm.
export async function PUT(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: "Nama usaha tidak boleh kosong" },
        { status: 400 },
      );
    }

    const profileData = {
      name: String(body.name).trim(),
      category: body.category ?? "",
      street: body.street ?? "",
      district: body.district ?? "",
      city: body.city ?? "",
      province: body.province ?? "",
      postalCode: body.postalCode ?? "",
      openHours: body.openHours ?? "",
      whatsapp: body.whatsapp ?? "",
      jobsText: body.jobsText ?? "",
      linkInsta: body.linkInsta ?? "",
      linkFb: body.linkFb ?? "",
      linkWeb: body.linkWeb ?? "",
      description: body.description ?? "",
      isPublished: true,
    };

    await ensureUser(userId);

    const updatedProfile = await prisma.umkmProfile.upsert({
      where: { userId },
      update: profileData,
      create: { userId, ...profileData },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("PUT /api/profileUmkm error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan profil", details: String(error) },
      { status: 500 },
    );
  }
}
