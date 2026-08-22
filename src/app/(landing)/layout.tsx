import type { Metadata } from "next";
import NavbarLanding from "@/components/landing/navbar";
import FooterLanding from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Beranda",
  description: "Selamat datang di platform Larisin",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <NavbarLanding />
      <main className="relative z-0 flex-1 bg-white">{children}</main>
      <FooterLanding />
    </div>
  );
}
