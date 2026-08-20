import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-5">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-snug">
              Temukan UMKM sekitar, bantu usahamu makin{" "}
              <span className="text-[#0D47A1]">laris</span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-lg">
              Cari produk lokal, cek info lowongan kerja, atau kelola pencatatan penjualan tokomu di satu tempat.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/cek-umkm"
                className="bg-[#0D47A1] hover:bg-[#0A3882] text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-all shadow-xs"
              >
                Jelajahi UMKM
              </Link>
              <Link
                href="/dashboard"
                className="bg-white hover:bg-slate-50 text-slate-700 font-medium px-5 py-2.5 rounded-lg text-sm border border-slate-300 transition-all"
              >
                Kelola usahamu
              </Link>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-5">
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 shadow-xs space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium border-b border-slate-200 pb-2">
                <span>Preview Toko Terdaftar</span>
                <span className="text-[#0D47A1] font-semibold">Aktif</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Warung Kopi Bu Slamet</h4>
                    <p className="text-xs text-slate-500">Kuliner • Sleman, Yogyakarta</p>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200">
                    ★ 4.8
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                  <span>12 Produk</span>
                  <span className="text-[#0D47A1] font-medium">1 Lowongan Kerja</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURE SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-14 w-full border-t border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 text-center mb-8">
          Satu platform, semua kebutuhan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-[#0D47A1]/50 transition-all space-y-2">
            <h3 className="font-bold text-slate-900">Eksplorasi UMKM</h3>
            <p className="text-sm text-slate-600">
              Cari tempat usaha lokal, lihat katalog produk, dan cek lokasi terdekat.
            </p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-[#0D47A1]/50 transition-all space-y-2">
            <h3 className="font-bold text-slate-900">Lowongan Lokal</h3>
            <p className="text-sm text-slate-600">
              Temukan informasi lowongan kerja yang di-posting langsung oleh pemilik UMKM.
            </p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-[#0D47A1]/50 transition-all space-y-2">
            <h3 className="font-bold text-slate-900">Dashboard Penjualan</h3>
            <p className="text-sm text-slate-600">
              Pantau grafik omzet harian dan export rekap transaksi ke file Excel.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="bg-slate-50 border-t border-slate-200 py-14">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-8">
            Cara kerja LarisIn
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3">
              <h3 className="font-bold text-[#0D47A1] text-base">Untuk Pengunjung</h3>
              <ul className="text-sm text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Cari UMKM berdasarkan lokasi atau kategori.</li>
                <li>Lihat katalog produk & kontak pemilik toko.</li>
                <li>Lamar lowongan kerja lokal secara langsung.</li>
              </ul>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3">
              <h3 className="font-bold text-[#0D47A1] text-base">Untuk Pemilik UMKM</h3>
              <ul className="text-sm text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Daftar akun & buat profil usaha.</li>
                <li>Upload katalog produk dan info lowongan.</li>
                <li>Catat penjualan & unduh laporan keuangan ke Excel.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA BANNER SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-14 w-full">
        <div className="bg-[#0D47A1] text-white rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Punya UMKM? Daftarkan sekarang, gratis</h2>
          <p className="text-blue-100 text-sm max-w-md mx-auto">
            Perluas jangkauan usahamu dan kelola pencatatan penjualan dengan lebih gampang.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-block bg-white text-[#0D47A1] font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-all"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}