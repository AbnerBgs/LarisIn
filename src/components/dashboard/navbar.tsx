"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  RiAddLine,
  RemixiconComponentType,
  RiDashboardLine,
  RiBox3Line,
  RiBarcodeBoxLine,
  RiStackLine,
  RiShoppingCartLine,
  RiFileList3Line,
  RiGroupLine,
  RiMoneyDollarCircleLine,
  RiBarChartBoxLine,
  RiSettings3Line,
  RiMoreLine,
  RiMapLine,
  RiIdCardLine,
  RiDashboardFill,
  RiBox3Fill,
  RiBarcodeBoxFill,
  RiStackFill,
  RiShoppingCartFill,
  RiFileList3Fill,
  RiGroupFill,
  RiMoneyDollarCircleFill,
  RiBarChartBoxFill,
  RiIdCardFill,
  RiSettings3Fill,
  RiStore2Line,
  RiStore2Fill,
} from "@remixicon/react";
import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { OriginButton } from "../ui/origin-button";
import CreateNewDialog from "./create-new-dialog";

interface NavCategory {
  label: string;
  navItems: NavItem[];
}

interface NavItem {
  label: string;
  href: string;
  icon: RemixiconComponentType;
  activeIcon?: RemixiconComponentType;
}

const navMenus: NavCategory[] = [
  {
    label: "",
    navItems: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: RiDashboardLine,
        activeIcon: RiDashboardFill,
      },
      {
        label: "Profil UMKM",
        href: "/profile-umkm",
        icon: RiStore2Line,
        activeIcon: RiStore2Fill,
      },
      {
        label: "Produk",
        href: "/product",
        icon: RiBox3Line,
        activeIcon: RiBox3Fill,
      },
      {
        label: "Kasir",
        href: "/orders",
        icon: RiFileList3Line,
        activeIcon: RiFileList3Fill,
      },
      {
        label: "Penjualan",
        href: "/sales",
        icon: RiShoppingCartLine,
        activeIcon: RiShoppingCartFill,
      },
      {
        label: "Keuangan",
        href: "/finance",
        icon: RiMoneyDollarCircleLine,
        activeIcon: RiMoneyDollarCircleFill,
      },
    ],
  },
];

// Urutan menu samping untuk pintasan Alt + angka (1 = Dashboard, dst.).
const shortcutPages: NavItem[] = navMenus.flatMap(({ navItems }) => navItems);

const mobileNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: RiDashboardLine,
  },
  {
    label: "Explore",
    href: "/product",
    icon: RiMapLine,
  },
  {
    label: "Penjualan",
    href: "/sales",
    icon: RiShoppingCartLine,
  },
  {
    label: "Lainnya",
    href: "/more",
    icon: RiMoreLine,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey) return;

      // Alt + N: buka popup "Buat Baru" — kecuali di halaman yang
      // punya pintasan Alt + N sendiri (Produk, Keuangan).
      if (e.key === "n") {
        e.preventDefault();
        if (
          pathname.startsWith("/product") ||
          pathname.startsWith("/finance")
        ) {
          return;
        }
        setCreateOpen(true);
        return;
      }

      // Alt + angka: lompat ke menu samping sesuai urutannya.
      const index = Number(e.key) - 1;
      const target = shortcutPages[index];
      if (target) {
        e.preventDefault();
        router.push(target.href);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pathname, router]);

  return (
    <>
      <aside className="hidden md:flex md:w-64 md:h-screen md:flex-col md:sticky md:top-0 md:shrink-0 border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-gray-900 hover:text-blue-600 transition-colors"
          >
            LarisIn
          </Link>
        </div>
        

        {/* Navigation */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pt-4">
          {navMenus.map(({ label, navItems }) => (
            <div key={label}>
              <p className="mb-2 px-3 text-xs font-mono font-semibold uppercase tracking-widest text-gray-400">
                {label}
              </p>

              <div className="space-y-1">
                {navItems.map(
                  ({ label, href, icon: Icon, activeIcon: ActiveIcon }) => {
                    const active =
                      pathname === href || pathname.startsWith(`${href}/`);

                    const CurrentIcon = active ? (ActiveIcon ?? Icon) : Icon;

                    return (
                      <Link
                        key={href}
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                        }`}
                      >
                        <CurrentIcon
                          size={18}
                          strokeWidth={active ? 2.25 : 2}
                        />

                        <span>{label}</span>
                      </Link>
                    );
                  },
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-gray-200 p-3">
          <Show when="signed-out">
            <SignInButton>
              <OriginButton className="bg-amber-300 w-full text-black font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer transition-all hard-shadow">
                Masuk
              </OriginButton>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <div
              role="button"
              tabIndex={0}
              className="flex w-full items-center gap-3 rounded-xl bg-amber-300 px-3 py-2 text-black border hard-shadow cursor-pointer transition-all"
              onClick={(e) => {
                const target = e.currentTarget.querySelector(
                  "button",
                ) as HTMLButtonElement | null;

                target?.click();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();

                  const target = e.currentTarget.querySelector(
                    "button",
                  ) as HTMLButtonElement | null;

                  target?.click();
                }
              }}
            >
              <div
                onClick={(e) => {
                  // Jangan biarkan click dari UserButton
                  // diteruskan ke parent
                  e.stopPropagation();
                }}
              >
                <UserButton />
              </div>

              {isLoaded && (
                <span className="truncate text-sm font-medium">
                  {user?.username ?? user?.firstName ?? "Pengguna"}
                </span>
              )}
            </div>
          </Show>
        </div>
      </aside>

      {/* Mobile navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="flex items-stretch justify-between px-1">
          {mobileNavItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                    active ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.4 : 2} />

                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* PopUp "Buat Baru" — produk */}
      <CreateNewDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaveProduct={() => {
          // Produk sudah disimpan ke API di dalam ProductForm.
          setCreateOpen(false);
        }}
      />
    </>
  );
}
