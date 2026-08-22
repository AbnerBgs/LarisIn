import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | LarisIn",
    default: "LarisIn - Sehat sehat UMKM",
  },
  description: "anu mas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="id" data-scroll-behavior="smooth">
        <body
          className={`${dmSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-slate-900`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}