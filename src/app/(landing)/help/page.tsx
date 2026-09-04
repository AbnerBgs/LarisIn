import type { Metadata } from "next";
import Link from "next/link";
import {
  RiArrowRightLine,
  RiStore2Line,
  RiBox3Line,
  RiFileList3Line,
  RiShoppingCartLine,
  RiMoneyDollarCircleLine,
  RiMapLine,
  RiDashboardLine,
  RiQuestionLine,
  RiLightbulbLine,
  RiKeyboardBoxLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import { OriginButton } from "@/components/ui/origin-button";
import PleaseReveal from "@/components/ui/please-reveal";

export const metadata: Metadata = {
  title: "Panduan",
  description: "Panduan penggunaan LarisIn yang mudah dipahami untuk semua orang.",
};

/* ------------------------------------------------------------------ */
/* Data konten panduan                                                */
/* ------------------------------------------------------------------ */

interface GuideSection {
  id: string;
  icon: RemixiconComponentType;
  title: string;
  /** Penjelasan singkat: halaman ini untuk apa. */
  purpose: string;
  steps: string[];
  /** Catatan tambahan (tips), boleh kosong. */
  tip?: string;
}

const QUICK_START = [
  {
    title: "Buat Akun",
    description:
      "Klik tombol \"Buat Akun\" di pojok kanan atas. Bisa daftar lewat email atau akun Google. Kalau sudah punya akun, cukup klik \"Masuk\".",
  },
  {
    title: "Lengkapi Profil UMKM",
    description:
      "Buka menu \"Profil UMKM\", klik Edit, lalu isi nama usaha, kategori, jam buka, alamat, nomor WhatsApp, dan deskripsi. Profil ini yang dilihat orang di halaman Cek UMKM, jadi isi selengkap mungkin.",
  },
  {
    title: "Tambah Produk",
    description:
      "Buka menu \"Produk\", klik \"Tambah Product\" . Isi nama, harga, jumlah stok, dan kategori. Foto boleh diisi belakangan.",
  },
  {
    title: "Catat Penjualan",
    description:
      "Buka menu \"Kasir\", isi nama kasir, pilih cara bayar (QRIS, Cash, atau Debit), lalu pilih produk dan jumlahnya. Stok produk berkurang otomatis setiap penjualan disimpan.",
  },
  {
    title: "Pantau Hasilnya",
    description:
      "Buka \"Dashboard\" untuk melihat ringkasan bulan ini, dan \"Keuangan\" untuk rincian uang masuk dan keluar.",
  },
];

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "dashboard",
    icon: RiDashboardLine,
    title: "Dashboard",
    purpose:
      "Ringkasan kondisi toko bulan ini.",
    steps: [
      "Total Pendapatan: semua uang yang masuk bulan ini, dari penjualan di Kasir dan pemasukan yang dicatat di Keuangan.",
      "Pendapatan Bersih: uang masuk dikurangi uang keluar. Ini uang yang benar-benar tersisa di toko.",
      "Total Pengunjung: jumlah transaksi yang dicatat Kasir bulan ini. Satu transaksi dihitung satu pelanggan.",
      "Grafik TOTAL PENJUALAN: omzet setiap harinya. Kalau kamu sudah mengatur target, garis target ikut tampil.",
      "Tulisan persentase hijau berarti naik, merah berarti turun dibanding bulan lalu.",
    ],
    tip: "Kalau angkanya masih Rp0, itu karena belum ada penjualan atau transaksi yang dicatat bulan ini.",
  },
  {
    id: "profil-umkm",
    icon: RiStore2Line,
    title: "Profil UMKM",
    purpose:
      "Kartu identitas usahamu. Semua yang kamu isi di sini ditampilkan ke pengunjung di halaman Cek UMKM.",
    steps: [
      "Klik tombol \"Edit\" di kanan atas kartu profil.",
      "Isi nama usaha, kategori, jam operasional, alamat lengkap, dan nomor WhatsApp.",
      "Sedang butuh pegawai? Pilih \"Sedang Membuka Lowongan\" lalu tulis posisi yang dicari, misalnya \"Kasir, Barista (Full-time)\".",
      "Tambahkan link Instagram, Facebook, atau website kalau ada.",
      "Tulis deskripsi usaha singkat, lalu klik \"Simpan\".",
    ],
    tip: "Nomor WhatsApp ditulis dengan kode negara, contoh: 6281234567890.",
  },
  {
    id: "produk",
    icon: RiBox3Line,
    title: "Produk",
    purpose:
      "Daftar semua barang yang kamu jual, lengkap dengan harga, stok, dan foto.",
    steps: [
      "Klik \"Tambah Product\" untuk membuat produk baru.",
      "Isi nama, harga, jumlah stok, dan pilih kategori (Makanan, Minuman, Alat, dan lainnya).",
      "Foto produk boleh diisi — maksimal 5 MB, dan otomatis dikecilkan supaya tidak berat.",
      "Klik nama produk untuk melihat detail lengkapnya.",
      "Ikon pensil untuk mengubah produk, ikon tempat sampah untuk menghapus. Menghapus selalu meminta konfirmasi dulu.",
      "Gunakan kotak pencarian untuk menemukan produk dengan cepat.",
    ],
    tip: "Stok otomatis berkurang setiap ada penjualan di Kasir. Tulisan \"Habis\" berwarna merah artinya stok sudah 0.",
  },
  {
    id: "kasir",
    icon: RiFileList3Line,
    title: "Kasir",
    purpose:
      "Halaman untuk mencatat penjualan saat ada pembeli.",
    steps: [
      "Isi nama kasir (nama yang bertugas saat itu).",
      "Pilih cara bayar: QRIS, Cash, atau Debit.",
      "Klik \"Tambah Produk\" untuk menambahkan barang, lalu atur jumlahnya.",
      "Jumlah total muncul otomatis di bawah formulir.",
      "Klik \"Cetak Struk\" untuk menyimpan sekaligus mencetak struk, atau kirim formulir untuk menyimpan saja.",
      "Tombol merah \"Reset\" mengosongkan formulir kalau kamu salah isi.",
    ],
    tip: "Di sebelah kanan ada pratinjau struk yang ikut berubah sambil kamu mengisi.",
  },
  {
    id: "penjualan",
    icon: RiShoppingCartLine,
    title: "Penjualan",
    purpose:
      "Riwayat semua transaksi yang pernah dicatat di Kasir, seperti buku catatan penjualan digital.",
    steps: [
      "Setiap transaksi tampil dengan Order ID, tanggal, nama kasir, total, dan cara bayar.",
      "Klik tombol hijau \"Export\" untuk mengunduh seluruh riwayat sebagai file Excel — praktis untuk laporan atau arsip.",
      "Salah catat? Klik tombol merah \"Hapus\" pada baris transaksi tersebut.",
    ],
    tip: "Data yang dihapus tidak bisa dikembalikan, jadi pastikan dulu saat muncul konfirmasi.",
  },
  {
    id: "keuangan",
    icon: RiMoneyDollarCircleLine,
    title: "Keuangan",
    purpose:
      "Pusat laporan keuangan: mencatat uang masuk dan keluar, melihat laba rugi, dan mengatur target bulanan.",
    steps: [
      "Klik \"Tambah Transaksi\" untuk mencatat pemasukan atau pengeluaran yang tidak lewat Kasir, misalnya belanja stok, bayar gaji, atau pemasukan dari jasa.",
      "Pilih kategori pengeluaran: Stok, Operasional, Gaji, atau Lainnya, supaya laporanmu rapi.",
      "Klik kartu \"Target Pendapatan\" untuk menentukan sasaran omzet bulanan. Kemajuannya dihitung otomatis.",
      "Gunakan menu periode di kanan atas untuk melihat data bulan ini, bulan lalu, atau rentang waktu lain.",
      "Bagian \"Laba & Rugi\" menghitung otomatis: pendapatan dikurangi biaya barang, dikurangi biaya operasional.",
      "Bagian \"Insight Bisnis\" memberikan catatan otomatis dari data tokomu, misalnya pengeluaran terbesar bulan ini.",
    ],
    tip: "Kasir mencatat jualanmu secara otomatis. Tips cepat: tekan Alt + N untuk membuka popup tambah transaksi, lalu tekan 1 untuk Pendapatan atau 2 untuk Pengeluaran.",
  },
  {
    id: "cek-umkm",
    icon: RiMapLine,
    title: "Cek UMKM",
    purpose:
      "Direktori umum untuk pengunjung.",
    steps: [
      "Ketik nama usaha, kategori, atau kota di kotak pencarian.",
      "Gunakan tombol kategori (Warung, Kedai & Kafe, Kuliner, Toko Kelontong, dan lainnya) dan menu kota untuk menyaring hasil.",
      "Klik \"Lihat Detail\" untuk melihat katalog produk dan lowongan kerja usaha tersebut.",
      "Klik tombol hijau WhatsApp untuk langsung chat dengan pemiliknya.",
    ],
    tip: "Sebagai pemilik toko, profilmu muncul di sini setelah kamu mengisi dan menyimpan halaman Profil UMKM.",
  },
];

const FAQ = [
  {
    q: "Apakah LarisIn gratis?",
    a: "Ya. Membuat akun dan memakai semua fiturnya gratis, tanpa biaya apa pun.",
  },
  {
    q: "Bagaimana caranya agar toko saya muncul di halaman Cek UMKM?",
    a: "Isi dan simpan halaman Profil UMKM. Setelah tersimpan, data usahamu otomatis tampil di direktori Cek UMKM.",
  },
  {
    q: "Apakah stok produk berkurang otomatis?",
    a: "Ya. Setiap penjualan yang disimpan di Kasir akan mengurangi stok produk sesuai jumlah yang terjual. Stok tidak akan menjadi minus.",
  },
  {
    q: "Kenapa angka di Dashboard dan Keuangan bisa sama?",
    a: "Keduanya menghitung hal yang sama: penjualan dari Kasir ditambah pemasukan manual yang dicatat di Keuangan. Jadi wajar kalau angkanya sama persis.",
  },
  {
    q: "Apa bedanya Kasir dengan tombol Tambah Transaksi di Keuangan?",
    a: "Kasir dipakai saat ada pembeli dan kamu menjual produk dari daftar Produk. \"Tambah Transaksi\" dipakai untuk uang masuk atau keluar lainnya, seperti belanja stok, bayar gaji, atau pemasukan dari jasa.",
  },
  {
    q: "Bisakah saya memperbaiki atau menghapus data yang salah?",
    a: "Bisa. Produk bisa diedit lewat ikon pensil, dan produk maupun transaksi bisa dihapus. Namun data yang dihapus tidak bisa dikembalikan — selalu ada konfirmasi sebelum menghapus.",
  },
  {
    q: "Berapa ukuran maksimal foto produk?",
    a: "Maksimal 5 MB. Foto otomatis dikecilkan oleh LarisIn supaya tidak membebani penyimpanan.",
  },
  {
    q: "Apakah saya perlu jago komputer untuk memakainya?",
    a: "Tidak. Semua dilakukan lewat klik dan isi formulir biasa, sama seperti memakai media sosial. Cukup pakai HP atau laptop dengan browser.",
  },
];

const SHORTCUT_GROUPS = [
  {
    title: "Tersedia di Semua Halaman",
    shortcuts: [
      { keys: "Alt + 1", action: "Buka Dashboard" },
      { keys: "Alt + 2", action: "Buka Profil UMKM" },
      { keys: "Alt + 3", action: "Buka Produk" },
      { keys: "Alt + 4", action: "Buka Kasir" },
      { keys: "Alt + 5", action: "Buka Penjualan" },
      { keys: "Alt + 6", action: "Buka Keuangan" },
      { keys: "Alt + N", action: "Buka popup \"Buat Baru\"" },
    ],
  },
  {
    title: "Per Halaman",
    shortcuts: [
      { keys: "Alt + N", action: "Di Produk: buka form Tambah Produk" },
      { keys: "Alt + N", action: "Di Keuangan: buka popup Tambah Transaksi" },
      { keys: "1 / 2", action: "Di popup Tambah Transaksi: pilih Pendapatan / Pengeluaran" },
      { keys: "Alt + E", action: "Di Penjualan: export riwayat ke Excel" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Komponen kecil                                                     */
/* ------------------------------------------------------------------ */

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-xl mx-auto text-center">
      <span className="font-mono text-xs tracking-[0.2em] uppercase text-indigo-500">
        {eyebrow}
      </span>
      <h2 className="font-display font-bold text-3xl md:text-4xl mt-2">
        {title}
      </h2>
      {description && (
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
          {description}
        </p>
      )}
    </div>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={step} className="flex items-start gap-3 text-sm text-slate-600">
          <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-400 text-white font-mono text-[11px] flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span className="leading-relaxed">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function GuideCard({ section }: { section: GuideSection }) {
  const Icon = section.icon;
  return (
    <article
      id={section.id}
      className="scroll-mt-24 p-6 md:p-7 bg-white border border-black rounded-2xl space-y-4 hard-shadow-static"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-black/10 text-indigo-500">
          <Icon size={20} />
        </span>
        <h3 className="font-display font-bold text-indigo-800 text-lg">
          {section.title}
        </h3>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">
        <span className="font-semibold text-slate-800">Untuk apa? </span>
        {section.purpose}
      </p>

      <div className="border-t border-dashed border-black/20 pt-4">
        <StepList steps={section.steps} />
      </div>

      {section.tip && (
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <RiLightbulbLine size={16} className="shrink-0 text-amber-500 mt-0.5" />
          <p className="text-xs leading-relaxed text-amber-900">
            <span className="font-semibold">Tips: </span>
            {section.tip}
          </p>
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Halaman                                                            */
/* ------------------------------------------------------------------ */

export default function HelpPage() {
  return (
    <div className="relative top-0 z-0 bg-white text-slate-900 flex flex-col font-sans">
      {/* 1. HERO */}
      <PleaseReveal>
        <section className="mx-auto px-6 py-14 w-full border-b border-slate-200 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-indigo-500">
              Bantuan &amp; Panduan
            </span>
            <h1 className="font-display font-bold text-3xl md:text-5xl mt-2 leading-tight">
              Cara Memakai{" "}
              <span className="text-[#0D47A1]">LarisIn</span>, Langkah demi
              Langkah
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
              <Link href="/dashboard">
                <OriginButton className="bg-amber-300 border border-black font-medium text-sm sm:text-base h-12 px-5 cursor-pointer hard-shadow">
                  <span className="inline-flex items-center justify-center gap-2">
                    Mulai Kelola Toko
                    <RiArrowRightLine className="h-4 w-4" />
                  </span>
                </OriginButton>
              </Link>
              <Link href="/cek-umkm">
                <OriginButton className="bg-blue-400 border border-black font-medium text-sm sm:text-base h-12 px-5 cursor-pointer hard-shadow">
                  Jelajahi UMKM
                </OriginButton>
              </Link>
            </div>
          </div>
        </section>
      </PleaseReveal>

      {/* 3. LANGKAH PERTAMA */}
      {/* threshold 0: bagian ini tinggi, 50% dari elemen tidak selalu
          muat di layar sehingga animasi reveal bisa tidak pernah jalan. */}
      <PleaseReveal threshold={0}>
        <section id="mulai" className="scroll-mt-24 py-14 border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <SectionHeader
              eyebrow="Mulai dari mana?"
              title="5 Langkah Pertama untuk Pemula"
              description="Kalau kamu baru pertama kali memakai LarisIn, ikuti lima langkah ini berurutan."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
              {QUICK_START.map((step, i) => (
                <div
                  key={step.title}
                  className="p-5 bg-white border border-black rounded-2xl hard-shadow-static flex flex-col"
                >
                  <span className="font-mono text-[11px] tracking-widest uppercase text-indigo-500">
                    Langkah {i + 1}
                  </span>
                  <h3 className="font-bold text-slate-900 mt-2">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-600 mt-2">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PleaseReveal>

      {/* 4. PANDUAN TIAP HALAMAN */}
      {/* threshold 0: bagian ini tinggi, 50% dari elemen tidak selalu
          muat di layar sehingga animasi reveal bisa tidak pernah jalan. */}
      <PleaseReveal threshold={0}>
        <section id="fitur" className="py-14 border-b border-slate-200 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <SectionHeader
              eyebrow="Panduan tiap halaman"
              title="Cara Memakai Setiap Fitur"
              description="Setiap fitur dijelaskan langkah demi langkah."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {GUIDE_SECTIONS.map((section) => (
                <GuideCard key={section.id} section={section} />
              ))}
            </div>
          </div>
        </section>
      </PleaseReveal>

      {/* 4.5. SHORTCUT */}
      <PleaseReveal threshold={0}>
        <section
          id="shortcut"
          className="scroll-mt-24 py-14 border-b border-slate-200 bg-white"
        >
          <div className="max-w-4xl mx-auto px-6 w-full">
            <SectionHeader
              eyebrow="Pintasan Keyboard"
              title="Lebih Cepat Pakai Shortcut"
              description="Beberapa tindakan bisa dilakukan tanpa klik, cukup tekan kombinasi tombol di bawah ini."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {SHORTCUT_GROUPS.map((group) => (
                <div
                  key={group.title}
                  className="p-6 bg-white border border-black rounded-2xl hard-shadow-static space-y-4"
                >
                  <h3 className="flex items-center gap-2.5 font-display font-bold text-indigo-800 text-lg">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-black/10 text-indigo-500">
                      <RiKeyboardBoxLine size={20} />
                    </span>
                    {group.title}
                  </h3>

                  <ul className="divide-y divide-slate-100">
                    {group.shortcuts.map((s) => (
                      <li
                        key={s.action}
                        className="flex items-center justify-between gap-3 py-2.5"
                      >
                        <span className="text-sm text-slate-600 leading-relaxed">
                          {s.action}
                        </span>
                        <kbd className="flex-shrink-0 rounded-lg border border-black/10 bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                          {s.keys}
                        </kbd>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PleaseReveal>

      {/* 5. PERTANYAAN UMUM */}
      {/* threshold 0: bagian ini tinggi, 50% dari elemen tidak selalu
          muat di layar sehingga animasi reveal bisa tidak pernah jalan. */}
      <PleaseReveal threshold={0}>
        <section id="faq" className="scroll-mt-24 py-14 border-b border-slate-200 bg-slate-50">
          <div className="max-w-3xl mx-auto px-6 w-full">
            <SectionHeader
              eyebrow="Masih bingung?"
              title="Pertanyaan yang Sering Ditanyakan"
            />

            <div className="mt-10 space-y-4">
              {FAQ.map((item) => (
                <div
                  key={item.q}
                  className="p-5 md:p-6 bg-white border border-black rounded-2xl hard-shadow-static"
                >
                  <h3 className="flex items-start gap-2.5 font-semibold text-slate-900">
                    <RiQuestionLine size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                    {item.q}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 mt-2 pl-7">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PleaseReveal>

      {/* 6. CTA PENUTUP */}
      <section className="px-6 py-14 w-full bg-sky-600">
        <PleaseReveal>
          <div className="max-w-3xl mx-auto text-white rounded-2xl p-8 text-center space-y-4 content-center">
            <h2 className="text-4xl font-bold text-amber-300">
              Siap Mencoba Sendiri?
            </h2>
            <p className="text-md max-w-md mx-auto">
              Membaca memang membantu, tapi mencoba langsung jauh lebih mudah.
              Semua langkah di atas bisa kamu praktikkan sekarang juga.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/dashboard">
                <OriginButton className="bg-amber-300 border border-black text-black font-medium text-sm sm:text-base h-12 px-5 cursor-pointer hard-shadow">
                  <span className="inline-flex items-center justify-center gap-2">
                    Mulai Kelola Toko
                    <RiArrowRightLine className="h-4 w-4" />
                  </span>
                </OriginButton>
              </Link>
              <Link href="/cek-umkm">
                <OriginButton className="bg-white border border-black text-black font-medium text-sm sm:text-base h-12 px-5 cursor-pointer hard-shadow">
                  Jelajahi UMKM
                </OriginButton>
              </Link>
            </div>
          </div>
        </PleaseReveal>
      </section>
    </div>
  );
}
