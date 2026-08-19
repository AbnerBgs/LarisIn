import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Area panel kontrol user Larisin",
  robots: {
    index: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen ">
      <div className="flex flex-1 flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
