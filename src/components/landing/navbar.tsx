"use client";

import React, { useEffect, useRef, useState } from "react";
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from "next/link";
import { RiMenuLine, RiCloseLine, RiArrowDownSLine } from "@remixicon/react";
import { usePathname } from "next/navigation";
import { OriginButton } from "../ui/origin-button";

const helpSections = [
  { href: "/help#mulai", label: "Langkah Utama" },
  { href: "/help#fitur", label: "Fitur" },
  { href: "/help#shortcut", label: "Shortcut" },
  { href: "/help#faq", label: "FAQ" },
];

export default function NavbarLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const helpRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  // LOCK BODY SCROLL SAAT MENU MOBILE TERBUKA
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Tutup dropdown saat pindah halaman
  useEffect(() => {
    setHelpOpen(false);
  }, [pathname]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/cek-umkm", label: "Cek UMKM" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/help", label: "Panduan", isDropdown: true },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 grid grid-cols-[auto_1fr_auto] bg-white border-b border-b-zinc-200 items-center h-20 px-4 md:px-15 transition-all duration-300 ease-out`}
      >
        {/* LOGO */}
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold">LarisIn</h1>
          </Link>
        </div>

        {/* NAV LINKS — centered, collapses to hamburger below 880px */}
        <ul className="hidden min-[880px]:flex justify-end items-center gap-7 pr-12">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.isDropdown) {
              return (
                <li key={link.label} ref={helpRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setHelpOpen((prev) => !prev)}
                    className={`relative flex items-center gap-1 text-md tracking-wide capitalize pb-1 transition-colors cursor-pointer ${
                      isActive
                        ? "text-black after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-0.5 after:bg-black"
                        : "text-inherit hover:text-black/70"
                    }`}
                  >
                    {link.label}
                    <RiArrowDownSLine
                      size={16}
                      className={`transition-transform ${helpOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {helpOpen && (
                    <div className="absolute right-0 top-full z-50 mt-3 w-60 rounded-2xl border border-black bg-white p-2 hard-shadow-static">
                      <Link
                        href="/help"
                        onClick={() => setHelpOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-blue-50"
                      >
                        Semua Panduan
                      </Link>

                      <div className="my-1 h-px bg-slate-100" />

                      {helpSections.map((section) => (
                        <Link
                          key={section.href}
                          href={section.href}
                          onClick={() => setHelpOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-black"
                        >
                          {section.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`relative text-md tracking-wide capitalize pb-1 transition-colors ${
                    isActive
                      ? "text-black after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-0.5 after:bg-black"
                      : "text-inherit hover:text-black/70"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* RIGHT SIDE: auth buttons always visible + hamburger toggle */}
        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <Show when="signed-out">
            <SignInButton>
              <a className="cursor-pointer text-sm sm:text-base">Masuk</a>
            </SignInButton>
            <SignUpButton>
              <OriginButton className="bg-amber-300  text-black font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer transition-all hard-shadow">
                Buat Akun
              </OriginButton>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>

          {/* HAMBURGER — only for nav links, visible under 880px */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="min-[880px]:hidden p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <RiCloseLine size={26} /> : <RiMenuLine size={26} />}
          </button>
        </div>
      </nav>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 min-[880px]:hidden"
        />
      )}

      {/* MOBILE PANEL — nav links only */}
      <div
        className={`fixed top-20 bottom-0 right-0 z-50 w-[85vw] max-w-sm min-[880px]:hidden bg-white shadow-lg border-l border-gray-100 flex flex-col p-4 gap-2 overflow-y-auto transform transition-transform duration-300 ease-in ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <div key={link.label}>
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2 px-2 text-base rounded-md block ${
                  isActive
                    ? "bg-blue-100 text-black font-semibold"
                    : "hover:bg-blue-50"
                }`}
              >
                {link.label}
              </Link>

              {link.isDropdown && (
                <div className="ml-4 border-l border-gray-100 pl-2 mt-1 space-y-0.5">
                  {helpSections.map((section) => (
                    <Link
                      key={section.href}
                      href={section.href}
                      onClick={() => setMobileOpen(false)}
                      className="py-1.5 px-2 text-sm text-slate-600 rounded-md block hover:bg-blue-50"
                    >
                      {section.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
