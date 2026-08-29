import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek UMKM",
  description:
    "Jelajahi UMKM terdaftar di LarisIn — cari katalog produk, lokasi, dan lowongan kerja lokal.",
};

export default function CekUmkmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
