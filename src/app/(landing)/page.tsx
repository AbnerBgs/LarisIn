"use client";

import Link from "next/link";
import { OriginButton } from "@/components/ui/origin-button";
import {
  RiArrowRightUpLine,
  RiArrowRightLine,
  RiMailLine,
  RiFileCopyLine,
  RiCheckLine,
  RiStore2Line,
  RiBriefcaseLine,
  RiBarChartBoxLine,
} from "@remixicon/react";
import { FeatureCard } from "@/components/ui/featured-card";
import { NoteCard } from "@/components/ui/note-card";
import { Show, SignUpButton } from "@clerk/nextjs";
import PleaseReveal from "@/components/ui/please-reveal";

export default function LandingPage() {
  const features = [
    {
      code: "001",
      icon: RiStore2Line,
      title: "Eksplorasi UMKM",
      description: "Cari tempat usaha lokal, lihat katalog produk, dan cek lokasi terdekat.",
      image: "/img/landing/explore.png",
    },
    {
      code: "002",
      icon: RiBriefcaseLine,
      title: "Lowongan Lokal",
      description: "Temukan info lowongan kerja yang diposting langsung oleh pemilik UMKM.",
      image: "/img/landing/hiring.jpg",
    },
    {
      code: "003",
      icon: RiBarChartBoxLine,
      title: "Dashboard Penjualan",
      description: "Pantau grafik omzet harian dan ekspor rekap transaksi ke Excel.",
      image: "/img/landing/dashboard.jpg",
    },
  ];
  return (
    <div className="relative top-0 z-0 bg-white text-slate-900 flex flex-col font-sans">
      {/* 1. HERO SECTION */}
      <PleaseReveal>
        <section className="relative top-0 z-0 max-w-7xl mx-auto px-6 w-full py-14 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center justify-center w-full lg:min-h-[calc(100vh-5rem)]">
            {/* Left Text */}
            <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left space-y-4 sm:space-y-5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                Temukan UMKM sekitar,
                <br className="hidden sm:block" />{" "}
                bantu usahamu makin{" "}
                <span className="text-[#0D47A1]">laris.</span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-md lg:max-w-lg">
                Cari produk lokal, cek info lowongan kerja, atau kelola pencatatan
                penjualan tokomu di satu tempat.
              </p>

              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 pt-2">
                <Link href="/cek-umkm" className="w-full sm:w-auto">
                  <OriginButton className="w-full sm:w-auto bg-blue-400 font-medium text-sm sm:text-base h-12 px-4 sm:px-5 cursor-pointer hard-shadow">
                    Jelajahi UMKM
                  </OriginButton>
                </Link>
                <OriginButton
                  className="w-full sm:w-auto bg-amber-300 border border-black hover:text-white font-medium text-sm sm:text-base h-12 px-4 sm:px-5 cursor-pointer hard-shadow"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = "/dashboard";
                    link.click();
                  }}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    Mulai Kelola Toko
                    <RiArrowRightLine className="h-4 w-4" />
                  </span>
                </OriginButton>
              </div>
            </div>

            {/* Right Preview Card */}
            <div className="lg:col-span-5 w-full flex justify-center pt-2 lg:pt-0">
              <NoteCard
                storeName="Warung Kopi Bu Slamet"
                category="Kuliner"
                location="Sleman, Yogyakarta"
                rating={4.8}
                productCount={12}
                jobCount={1}
                className="w-full"
              />
            </div>
          </div>
        </section>
      </PleaseReveal>

      {/* 2. FEATURE SECTION */}
      <PleaseReveal>
        <section className="mx-auto px-6 py-14 w-full border-t border-slate-200 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6 w-full min-h-[600] content-center">
            <div className="max-w-xl mx-auto text-center mb-12">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-indigo-500">
                Fitur Larisin
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl mt-2">
                Satu platform, semua kebutuhan
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f) => (
                <FeatureCard key={f.code} {...f} />
              ))}
            </div>
          </div>
        </section>
      </PleaseReveal>

      {/* 3. HOW IT WORKS SECTION */}
      <PleaseReveal>
        <section className="bg-white border-t border-slate-200 py-14">
          <div className="max-w-6xl mx-auto px-6 w-full min-h-[600] content-center">
            <div className="max-w-xl mx-auto text-center mb-12">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-indigo-500">
                Mudah digunakan
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl mt-2">
                Cara kerja LarisIn
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Untuk Pengunjung",
                  subtitle: "user",
                  steps: [
                    "Cari UMKM berdasarkan lokasi atau kategori.",
                    "Lihat katalog produk & kontak pemilik toko.",
                    "Lamar lowongan kerja lokal secara langsung.",
                  ],
                  image: "/img/landing/user.jpg",
                },
                {
                  title: "Untuk Pemilik UMKM",
                  subtitle: "owner",
                  steps: [
                    "Daftar akun & buat profil usaha.",
                    "Unggah katalog produk dan info lowongan.",
                    "Catat penjualan & unduh laporan ke Excel.",
                  ],
                  image: "/img/landing/owner.jpg",
                },
              ].map((col) => (
                <div
                  key={col.title}
                  className="p-6 md:p-7 bg-white border border-black rounded-2xl space-y-4 hard-shadow-static"
                >
                  <div
                    className="relative h-60 bg-cover bg-top"
                    style={{ backgroundImage: `url('${col.image}')` }}
                  >
                    <span className="absolute font-mono text-[10px] tracking-widest bg-white border px-2 py-0.5 rounded uppercase">
                      {col.subtitle}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-indigo-800 text-lg pb-4">
                      {col.title}
                    </h3>
                    <ul className="space-y-3">
                      {col.steps.map((step, i) => (
                        <li key={step} className="flex items-start gap-3 text-sm text-slate-600">
                          <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-400 text-white font-mono text-[11px] flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PleaseReveal>

      {/* 4. CTA BANNER SECTION */}
        <section className="px-6 py-14 w-full border-t border-slate-200 bg-sky-600">
          <PleaseReveal>
            <div className="max-w-6xl mx-auto text-white rounded-2xl p-8 text-center space-y-4 min-h-100 content-center">
              <h2 className="text-5xl font-bold text-amber-300">
                Punya UMKM?<br/>
                Daftarkan sekarang, Gratis
              </h2>
              <p className="text-md max-w-md mx-auto">
                Perluas jangkauan usahamu dan kelola pencatatan penjualan dengan
                lebih gampang.
              </p>
              <div className="pt-2">
                <Show when="signed-out">
                  <SignUpButton>
                    <OriginButton className="bg-amber-300  text-black font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer transition-all hard-shadow">
                      Daftar Gratis
                    </OriginButton>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <Link
                    href="/dashboard"
                  >
                    <OriginButton className="bg-amber-300 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hard-shadow inline-flex">
                      Lanjut ke Dashboard <RiArrowRightLine className="h-4 w-4" />
                    </OriginButton>
                  </Link>
                </Show>
              </div>
            </div>
          </PleaseReveal>
        </section>
    </div>
  );
}
