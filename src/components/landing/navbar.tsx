"use client";

import React, { useEffect, useState } from "react";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from "next/link";
import { RiMenuLine, RiCloseLine } from "@remixicon/react";
import { usePathname } from "next/navigation";
import { OriginButton } from "../ui/origin-button";

export default function NavbarLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // SCROLL HANDLER
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // LOCK BODY SCROLL SAAT MENU MOBILE TERBUKA
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/umkm", label: "Cek UMKM" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/help", label: "Panduan" },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 grid grid-cols-[auto_1fr_auto] items-center backdrop-blur-lg h-20 px-4 md:px-15 transition-all duration-300 ease-out ${
          mobileOpen
            ? "bg-white shadow-md shadow-black/10"
            : isScrolled
              ? "bg-white/10 shadow-md shadow-black/10"
              : "shadow-none"
        }`}
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
          <ClerkProvider>
            <Show when="signed-out">
              <SignInButton>
                <a className="cursor-pointer text-sm sm:text-base">Masuk</a>
              </SignInButton>
              <SignUpButton>
                <OriginButton className="bg-[#FFCC00]  text-black font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer transition-all drop-shadow-[0_4px_0_rgba(0,0,0,1)] hover:drop-shadow-[0_0px_0_rgba(0,0,0,1)] hover:translate-y-1">
                  Buat Akun
                </OriginButton>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </ClerkProvider>

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
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`py-2 px-2 text-base rounded ${
                isActive
                  ? "bg-[#FBF6F0] text-black font-semibold"
                  : "hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}