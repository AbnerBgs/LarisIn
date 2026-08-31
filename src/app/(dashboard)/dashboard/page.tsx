import { auth } from "@clerk/nextjs/server";
import SalesChart from "@/components/dashboard/sales-chart";
import PleaseReveal from "@/components/ui/please-reveal";
import { prisma } from "@/lib/prisma";
import { formatIDR } from "@/lib/finance";
import {
  RiArrowRightLine,
  RiArrowRightUpLine,
  RemixiconComponentType,
  RiCurrencyLine,
  RiMoneyDollarCircleLine,
  RiGroup3Line,
} from "@remixicon/react";

type StatCard = {
  label: string;
  value: string;
  change: string;
  /** Persentase perubahan; null = belum ada data pembanding. */
  changeUp: number | null;
  bg: string;
  valueColor: string;
  icon: RemixiconComponentType;
};

/** Persentase perubahan (bulat) — null bila tidak ada pembanding. */
function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function formatRp(value: number): string {
  return value >= 0 ? formatIDR(value) : `-${formatIDR(Math.abs(value))}`;
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { userId } = await auth();
  const resolvedParams = await searchParams;
  const now = new Date();

  // Label bulan untuk tampilan; data selalu dihitung untuk bulan berjalan.
  const currentMonth =
    resolvedParams?.month ||
    now.toLocaleDateString("id-ID", { month: "long" });

  // Rentang bulan berjalan & bulan lalu (UTC midnight agar konsisten
  // dengan kolom DATE TransaksiKeuangan).
  const monthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const nextMonthStart = new Date(
    Date.UTC(now.getFullYear(), now.getMonth() + 1, 1),
  );
  const prevMonthStart = new Date(
    Date.UTC(now.getFullYear(), now.getMonth() - 1, 1),
  );

  let income = 0;
  let prevIncome = 0;
  let expense = 0;
  let prevExpense = 0;
  let visitors = 0;
  let prevVisitors = 0;
  let salesByDay: { date: string; total: number }[] = [];
  let monthlyTarget = 0;

  if (userId) {
    const [
      incomeAgg,
      prevIncomeAgg,
      manualIncomeAgg,
      prevManualIncomeAgg,
      expenseAgg,
      prevExpenseAgg,
      sales,
      targetRow,
    ] = await Promise.all([
      prisma.penjualan.aggregate({
        where: { userId, createdAt: { gte: monthStart, lt: nextMonthStart } },
        _sum: { total: true },
      }),
      prisma.penjualan.aggregate({
        where: { userId, createdAt: { gte: prevMonthStart, lt: monthStart } },
        _sum: { total: true },
      }),
      prisma.transaksiKeuangan.aggregate({
        where: {
          userId,
          type: "income",
          date: { gte: monthStart, lt: nextMonthStart },
        },
        _sum: { amount: true },
      }),
      prisma.transaksiKeuangan.aggregate({
        where: {
          userId,
          type: "income",
          date: { gte: prevMonthStart, lt: monthStart },
        },
        _sum: { amount: true },
      }),
      prisma.transaksiKeuangan.aggregate({
        where: {
          userId,
          type: "expense",
          date: { gte: monthStart, lt: nextMonthStart },
        },
        _sum: { amount: true },
      }),
      prisma.transaksiKeuangan.aggregate({
        where: {
          userId,
          type: "expense",
          date: { gte: prevMonthStart, lt: monthStart },
        },
        _sum: { amount: true },
      }),
      prisma.penjualan.findMany({
        where: { userId },
        select: { createdAt: true, total: true },
      }),
      prisma.targetPendapatan.findUnique({ where: { userId } }),
    ]);

    // Pendapatan = penjualan kasir + pemasukan manual — definisi yang
    // sama dengan halaman Keuangan agar angka selalu konsisten.
    income = (incomeAgg._sum.total ?? 0) + (manualIncomeAgg._sum.amount ?? 0);
    prevIncome =
      (prevIncomeAgg._sum.total ?? 0) + (prevManualIncomeAgg._sum.amount ?? 0);
    expense = expenseAgg._sum.amount ?? 0;
    prevExpense = prevExpenseAgg._sum.amount ?? 0;
    monthlyTarget = targetRow?.amount ?? 0;

    // Total Pengunjung = berapa kali kasir melayani pelanggan, yaitu
    // jumlah transaksi kasir (Penjualan) bulan ini.
    visitors = sales.filter(
      (s) => s.createdAt >= monthStart && s.createdAt < nextMonthStart,
    ).length;
    prevVisitors = sales.filter(
      (s) => s.createdAt >= prevMonthStart && s.createdAt < monthStart,
    ).length;

    // Total penjualan per tanggal untuk grafik (yyyy-mm-dd).
    const daily = new Map<string, number>();
    for (const sale of sales) {
      const key = sale.createdAt.toISOString().slice(0, 10);
      daily.set(key, (daily.get(key) ?? 0) + sale.total);
    }
    salesByDay = Array.from(daily.entries()).map(([date, total]) => ({
      date,
      total,
    }));
  }

  const net = income - expense;
  const incomeChange = pctChange(income, prevIncome);
  const netChange = pctChange(net, prevIncome - prevExpense);
  const visitorsChange = pctChange(visitors, prevVisitors);

  const changeText = (change: number | null) =>
    change === null
      ? "Belum ada data bulan lalu"
      : `${change >= 0 ? "+" : ""}${change}% dari bulan lalu`;

  const stats: StatCard[] = [
    {
      label: "Total Pendapatan",
      value: formatRp(income),
      change: changeText(incomeChange),
      changeUp: incomeChange,
      bg: "bg-blue-100",
      valueColor: "text-blue-900",
      icon: RiCurrencyLine,
    },
    {
      label: "Pendapatan Bersih",
      value: formatRp(net),
      change: changeText(netChange),
      changeUp: netChange,
      bg: "bg-amber-100",
      valueColor: "text-amber-900",
      icon: RiMoneyDollarCircleLine,
    },
    {
      // Total Pengunjung = jumlah transaksi kasir (Penjualan) — setiap
      // penjualan berarti kasir melayani satu pelanggan.
      label: "Total Pengunjung",
      value: String(visitors),
      change: changeText(visitorsChange),
      changeUp: visitorsChange,
      bg: "bg-emerald-100",
      valueColor: "text-emerald-900",
      icon: RiGroup3Line,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
        <PleaseReveal>
          <div>
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
              RINGKASAN
            </h1>
            {/* 3. Tampilkan bulan secara dinamis di deskripsi */}
            <p className="mt-1 text-sm text-gray-500">
              Berikut adalah ringkasan data secara keseluruhan untuk bulan{" "}
              <span className="font-semibold text-gray-800">{currentMonth}</span>.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`border border-slate-200 rounded-xl bg-slate-100`}
                >
                  <div className="p-4 flex items-start justify-between">
                    <span className="text-xs font-medium text-gray-600">
                      {stat.label}
                    </span>
                    <stat.icon size={20} className="text-gray-600" />
                  </div>
                  <div
                    className={`${stat.bg} p-4 rounded-xl border hard-shadow`}
                  >
                    <p
                      className={`text-2xl font-mono font-bold ${stat.valueColor}`}
                    >
                      {stat.value}
                    </p>
                    <p
                      className={`mt-1 flex items-center gap-1 text-xs font-mono ${
                        stat.changeUp === null
                          ? "text-gray-600"
                          : stat.changeUp >= 0
                            ? "text-green-600"
                            : "text-red-500"
                      }`}
                    >
                      <RiArrowRightUpLine
                        size={14}
                        className={
                          stat.changeUp !== null && stat.changeUp < 0
                            ? "text-red-500"
                            : "text-green-600"
                        }
                      />
                      {stat.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PleaseReveal>

        <PleaseReveal>
          <div className="mt-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900 md:text-xl">
                  TOTAL PENJUALAN
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Berikut adalah Statistik Penjualan.
                </p>
              </div>
              <button
                type="button"
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Lihat
                <RiArrowRightLine size={16} />
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 md:p-6">
              <h3 className="text-sm font-semibold text-gray-900">
                Data Penjualan Teratas ({currentMonth})
              </h3>
              <p className="text-xs text-gray-500">
                Total unit terjual per item
              </p>
              {/*  Tampilkan chart penjualan dengan data dari database */}
              <SalesChart
                month={currentMonth}
                sales={salesByDay}
                monthlyTarget={monthlyTarget}
              />
            </div>
          </div>
        </PleaseReveal>
      </section>
    </div>
  );
}
