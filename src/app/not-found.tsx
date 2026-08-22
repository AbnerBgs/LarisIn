'use client'

import NavbarLanding from "@/components/landing/navbar";
import { OriginButton } from "@/components/ui/origin-button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [count, setCount] = useState(400);

  let maxCount = 409;

  useEffect(() => {
    let current = 400;
    const interval = setInterval(() => {
      setCount(current);
      if (current >= maxCount) {
        maxCount = 404;
        current -= 1;

        if (current < 404) {
          clearInterval(interval);
        }
      } else {
        current += 1;
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <NavbarLanding />
      <main className="relative z-0 flex-1 bg-white">
        <div className="relative top-0 z-0 bg-white text-slate-900 flex flex-col font-sans">
          <section className="relative top-0 z-0 max-w-7xl mx-auto px-6 w-full py-14 lg:py-0">
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
              <h1 className="text-[120px] lg:text-[160px] font-mono font-bold text-black leading-none">
                {count}
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 mt-4 max-w-md">
                Maaf, halaman yang Anda cari tidak ditemukan atau Anda tidak memiliki akses ke halaman tersebut.
              </p>
              <Link
                href="/"
                className="mt-8"
              >
                <OriginButton className="bg-blue-400 border border-black hard-shadow text-white">
                  Kembali ke Beranda
                </OriginButton>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}