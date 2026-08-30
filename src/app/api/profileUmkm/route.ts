import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let profile = await prisma.profile.findUnique({
      where: { id: "default-profile" },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: { id: "default-profile", name: "Nama Usaha" },
      });
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Gagal mengambil profil:", error);
    return NextResponse.json(
      { error: "Gagal mengambil profil" },
      { status: 500 }
    );
  }
}

// PUT: Update profil ke database
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const profileData = {
      name: body.name || "Nama Usaha",
      category: body.category ?? "",
      street: body.street ?? "",
      district: body.district ?? "",
      city: body.city ?? "",
      province: body.province ?? "",
      postalCode: body.postalCode ?? "",
      openHours: body.openHours ?? "", // 👈 KUNCI: Tambahkan ini agar tersimpan ke DB
      whatsapp: body.whatsapp ?? "",
      jobsText: body.jobsText ?? "",
      linkInsta: body.linkInsta ?? "",
      linkFb: body.linkFb ?? "",
      linkWeb: body.linkWeb ?? "",
      description: body.description ?? "",
    };

    const updatedProfile = await prisma.profile.upsert({
      where: { id: "default-profile" },
      update: profileData,
      create: {
        id: "default-profile",
        ...profileData,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    console.error("Error updating profile (API Error):", error);

    return NextResponse.json(
      {
        error: "Gagal menyimpan profil",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}