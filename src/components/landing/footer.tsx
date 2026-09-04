import Link from 'next/link';
import Image from 'next/image';

export default function FooterLanding() {
  return (
    <footer className="bg-zinc-900 text-zinc-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-white"
            >
              <Image src={"/icon.svg"} alt={"icon"} width={32} height={32}/>

              LarisIn
            </Link>

            <p className="mt-5 text-sm leading-6 text-zinc-400">
              Platform digital sederhana untuk membantu UMKM mengelola
              produk, stok, penjualan, dan perkembangan bisnis dalam satu
              tempat.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Menu
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Beranda
                </Link>
              </li>

              <li>
                <Link
                  href="/cek-umkm"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Cek UMKM
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  href="/help"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Panduan
                </Link>
              </li>
            </ul>
          </div>

          {/* Fitur */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Fitur
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/product"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Manajemen Produk
                </Link>
              </li>

              <li>
                <Link
                  href="/orders"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Kasir
                </Link>
              </li>

              <li>
                <Link
                  href="/sales"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Riwayat Penjualan
                </Link>
              </li>

              <li>
                <Link
                  href="/finance"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Keuangan
                </Link>
              </li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Bantuan
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Panduan Pengguna
                </Link>
              </li>

              <li>
                <Link
                  href="/help#faq"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Pertanyaan Umum
                </Link>
              </li>

              <li>
                <Link
                  href="/help#shortcut"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Pintasan Keyboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col gap-4 border-t border-zinc-800 pt-8 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-zinc-500">
            © 2026 LarisIn. All rights reserved.
          </p>

          <p className="text-zinc-500">
            Dibuat untuk membantu UMKM Indonesia berkembang.
          </p>
        </div>
      </div>
    </footer>
  );
}
