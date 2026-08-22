import Link from 'next/link';
import {
  RiGithubLine,
  RiInstagramLine,
  RiLinkedinLine,
  RiArrowRightUpLine,
} from '@remixicon/react';

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
              <div className="flex size-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-zinc-900">
                Li
              </div>

              LarisIn
            </Link>

            <p className="mt-5 text-sm leading-6 text-zinc-400">
              Platform digital sederhana untuk membantu UMKM mengelola
              produk, stok, penjualan, dan perkembangan bisnis dalam satu
              tempat.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Produk
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Fitur
                </Link>
              </li>

              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Cara Kerja
                </Link>
              </li>

              <li>
                <Link
                  href="#demo"
                  className="inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Demo
                  <RiArrowRightUpLine size={14} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Fitur
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Manajemen Produk
                </Link>
              </li>

              <li>
                <Link
                  href="#features"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Barcode Scanner
                </Link>
              </li>

              <li>
                <Link
                  href="#features"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Manajemen Stok
                </Link>
              </li>

              <li>
                <Link
                  href="#features"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Penjualan
                </Link>
              </li>

              <li>
                <Link
                  href="#features"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Business Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Bantuan
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="#faq"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  FAQ
                </Link>
              </li>

              <li>
                <Link
                  href="#guide"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Panduan
                </Link>
              </li>

              <li>
                <Link
                  href="#contact"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Hubungi Kami
                </Link>
              </li>

              <li>
                <Link
                  href="#feedback"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Berikan Feedback
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

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="text-zinc-500 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-zinc-500 transition-colors hover:text-white"
            >
              Terms of Service
            </Link>

            <Link
              href="#contact"
              className="text-zinc-500 transition-colors hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}