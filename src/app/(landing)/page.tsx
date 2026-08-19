"use client";

import { OriginButton } from "@/components/ui/origin-button";
import { RiArrowRightLine } from "@remixicon/react";

export default function Home() {
  return (
    <div className="relative font-sans">
      <section
        id="home"
        className="flex flex-col h-screen items-center justify-center bg-white"
      >
        <div className="flex w-full max-w-7xl  flex-col items-center  justify-between py-32 px-16 text-black">
          <h1 className="text-6xl font-semibold text-black">
            Your Business Growth Starts Here
          </h1>
          <h3 className="mt-3 text-xl max-w-3xl text-center text-black">
            Dari pantau penjualan harian hingga analisis keuangan, semua
            instrumen bisnis UMKM kamu kini makin simpel dan cepat.
          </h3>

          <OriginButton
            className="h-11 mt-5 rounded-full md:rounded-xl border border-black/15 bg-white text-black shadow-[0_1px_0_rgba(17,17,17,0.06)] hover:border-black hover:bg-black hover:text-white"
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/";
              link.click();
            }}
          >
            <span className="inline-flex text-lg items-center gap-2">
              Get Started
              <RiArrowRightLine className="h-4 w-4" />
            </span>
          </OriginButton>
        </div>
      </section>

      <section
        id="about"
        className="flex flex-col h-screen items-center  justify-center"
      >
        <div className="flex w-full h-auto max-w-7xl flex-col py-32 px-16 items-center justify-between">
          <h1 className="text-xl font-semibold text-black">next section</h1>
        </div>
      </section>
    </div>
  );
}
