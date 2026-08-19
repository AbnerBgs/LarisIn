"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RiAddLine,
  RiSearchLine,
  RiMenuLine,
  RiCloseLine,
  RiEditBoxLine,
} from "@remixicon/react";
import { usePathname } from "next/navigation";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export default function NavbarLanding() {
  const [hasPostedJobs, setHasPostedJobs] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // SCROLL HANDLER
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // LOCK BODY SCROLL SAAT MENU MOBILE TERBUKA
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: "/", label: "beranda" },
    { href: "/umkm", label: "Cek UMKM" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/help", label: "Panduan" },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 flex items-center justify-between backdrop-blur-lg h-20 px-4 md:px-15 transition-all duration-300 ease-out ${
          mobileOpen
            ? "bg-white shadow-md shadow-black/10"
            : isScrolled
              ? "bg-white/10 shadow-md shadow-black/10"
              : "shadow-none"
        }`}
      >
        <div className="relative ">
          {/* <Link href="/">
            <Image
              src="/logo/kerjabagus_icon.svg"
              alt="Kerjabagus logo"
              fill
              priority
              className="object-contain"
            />
          </Link> */}
          <h1 className="text-2xl font-bold">LarisIN</h1>
        </div>

        <div className="flex gap-10">
          {/* MENU DESKTOP */}
          <ul id="nav-links" className="hidden xl:flex p-5 gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`relative text-sm tracking-wide uppercase pb-1 transition-colors ${
                      isActive
                        ? "text-black after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-0.5 after:bg-black"
                        : "text-inherit"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ACTIONS DESKTOP */}
          <div className="hidden xl:flex items-center gap-4">
            <ShimmerButton className="shadow-2xl">
              <a href="/login" className="cursor-pointer text-[14px]">
                Masuk
              </a>
            </ShimmerButton>
            {/* {userData ? ( */}
            {/* <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#F6D39E] bg-[#FBF6F0]/80 hover:bg-[#FBF6F0] transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E2D2B4] text-xs font-bold text-[#386641]">
                  {getUsernameInitials(profileData?.displayName ?? "")}
                </div>
                <span className="text-sm font-semibold text-[#386641] max-w-30 truncate">
                  {profileData?.displayName ?? ""}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-[#77746E] border border-[#F6D39E] bg-[#FBF6F0] py-2 px-9 rounded-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-103 cursor-pointer"
              >
                Masuk
              </Link> */}
            {/* )} */}

            {/* DYNAMIC ACTION BUTTON
            {shouldShowManageJobs ? (
              <Link
                href="/jobs/manage"
                className="bg-[#F4991A] text-white py-2 px-4 rounded-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-103 cursor-pointer flex items-center gap-1.5 font-medium text-base"
              >
                <RiEditBoxLine size={20} />
                Kelola Pekerjaan
              </Link>
            ) : userData?.isFreelancer ? (
              <Link
                href="/jobs"
                className="bg-[#386641] text-white py-2 px-4 rounded-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-103 cursor-pointer flex items-center gap-1.5 font-medium text-base"
              >
                <RiSearchLine size={20} />
                Cari Lowongan
              </Link>
            ) : (
              <Link
                href="/jobs/create"
                className="bg-[#F4991A] text-white py-2 px-4 rounded-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-103 cursor-pointer flex items-center gap-1.5 font-medium text-base"
              >
                <RiAddLine size={20} />
                Post Pekerjaan
              </Link>
            )} */}
          </div>
        </div>
        {/* HAMBURGER MOBILE */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="xl:hidden p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <RiCloseLine size={28} /> : <RiMenuLine size={28} />}
        </button>
      </nav>

      {/* OVERLAY GELAP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 xl:hidden"
        />
      )}

      {/* MENU MOBILE */}
      <div
        className={`fixed top-20 bottom-0 right-0 z-50 w-[85vw] max-w-sm xl:hidden bg-white shadow-lg border-l border-gray-100 flex flex-col p-4 gap-4 overflow-y-auto transform transition-transform duration-300 ease-in ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-3">
          {/* {userData ? (
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg border border-[#F6D39E] bg-[#FBF6F0]/80"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E2D2B4] text-xs font-bold text-[#386641]">
                {getUsernameInitials(profileData?.displayName ?? "")}
              </div>
              <span className="text-sm font-semibold text-[#386641] truncate">
                {profileData?.displayName ?? ""}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-center text-[#77746E] border border-[#F6D39E] bg-[#FBF6F0] py-2 px-9 rounded-lg"
            >
              Masuk
            </Link>
          )} */}
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="text-center text-[#77746E] border border-[#F6D39E] bg-[#FBF6F0] py-2 px-9 rounded-lg"
          >
            Masuk
          </Link>
        </div>

        <div className="flex flex-col gap-2">
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
      </div>
    </>
  );
}
