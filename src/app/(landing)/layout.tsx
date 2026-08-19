import type { Metadata } from "next";
import NavbarLanding from "@/components/landing/navbar";

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
    <div className="flex min-h-screen flex-col">
      <NavbarLanding />
      <main className="flex-1">{children}</main>
    </div>
  );
}
