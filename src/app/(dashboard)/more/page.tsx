import Link from "next/link";
import {
  RiArrowRightSLine,
  RiBarcodeBoxLine,
  RiBox3Line,
  RiDashboardLine,
  RiFileList3Line,
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
  RiStackLine,
  RiStore2Line,
} from "@remixicon/react";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: RiDashboardLine },
  { label: "Produk", href: "/product", icon: RiBox3Line },
  { label: "Kasir", href: "/orders", icon: RiFileList3Line },
  { label: "Penjualan", href: "/sales", icon: RiShoppingCartLine },
  { label: "Keuangan", href: "/finance", icon: RiMoneyDollarCircleLine },
];

export default function MorePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-2xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
        <div className="mb-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-400">
            Menu
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Lainnya</h1>
          <p className="mt-1 text-sm text-gray-500">
            Akses profil usaha dan seluruh fitur LarisIn.
          </p>
        </div>

        <Link
          href="/profile-umkm"
          className="mb-6 flex items-center gap-4 rounded-2xl border border-black bg-amber-300 p-4 text-black hard-shadow transition-transform hover:-translate-y-0.5"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-black bg-white">
            <RiStore2Line size={25} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold uppercase tracking-widest text-gray-700">
              Pengaturan usaha
            </span>
            <span className="mt-1 block text-base font-bold">Profil UMKM</span>
          </span>
          <RiArrowRightSLine size={24} />
        </Link>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-md font-bold text-gray-900">Navigasi</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {navigationItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={`${label}-${href}`}
                href={href}
                className="flex min-h-14 items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <Icon size={20} />
                <span className="flex-1">{label}</span>
                <RiArrowRightSLine size={20} className="text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
