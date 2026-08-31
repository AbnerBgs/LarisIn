// src/lib/finance.ts
// Lapisan data halaman Keuangan: tipe, data dummy, dan helper perhitungan.
//
// Halaman hanya membaca data lewat modul ini, jadi saat API asli sudah siap
// cukup ganti cara `FinanceTransaction[]` awal diproduksi
// (lihat `createMockTransactions`).

export type TransactionType = "income" | "expense";

export interface FinanceTransaction {
  id: string;
  type: TransactionType;
  description: string;
  /** Selalu positif — `type` yang menentukan arah (masuk/keluar). */
  amount: number;
  category: string;
  /** Tanggal transaksi dalam format ISO (yyyy-mm-dd). */
  date: string;
  note?: string;
}

/** Input dari form "Tambah Transaksi" — bentuk siap pakai untuk API nanti. */
export interface NewFinanceTransaction {
  type: TransactionType;
  description: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export const INCOME_CATEGORIES = [
  "Penjualan",
  "Pesanan Online",
  "Jasa",
  "Lainnya",
] as const;

export const EXPENSE_CATEGORIES = [
  "Stok",
  "Operasional",
  "Gaji",
  "Lainnya",
] as const;

export type FinancePeriodKey =
  | "this-month"
  | "last-month"
  | "last-3-months"
  | "this-year";

export const FINANCE_PERIOD_OPTIONS: {
  key: FinancePeriodKey;
  label: string;
}[] = [
  { key: "this-month", label: "Bulan Ini" },
  { key: "last-month", label: "Bulan Lalu" },
  { key: "last-3-months", label: "3 Bulan Terakhir" },
  { key: "this-year", label: "Tahun Ini" },
];

export type ChartBucket = "day" | "week" | "month";

export interface FinancePeriod {
  key: FinancePeriodKey;
  label: string;
  /** Label rentang tanggal yang bisa dibaca, mis. "1–29 Agustus 2026". */
  rangeLabel: string;
  start: Date;
  end: Date;
  prevStart: Date;
  prevEnd: Date;
  bucket: ChartBucket;
}

/* ------------------------------------------------------------------ */
/* Util tanggal                                                        */
/* ------------------------------------------------------------------ */

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/** Format tanggal lokal (bukan UTC) menjadi ISO yyyy-mm-dd. */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayISO(now = new Date()): string {
  return toISODate(now);
}

/** "29 Agu 2026" */
export function formatTxDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/* Periode                                                             */
/* ------------------------------------------------------------------ */

/**
 * Rentang tanggal untuk satu periode. Periode pembanding selalu punya
 * panjang yang sama dan berada tepat sebelum periode aktif.
 */
export function getFinancePeriod(
  key: FinancePeriodKey,
  now = new Date(),
): FinancePeriod {
  const today = startOfDay(now);
  const y = today.getFullYear();
  const m = today.getMonth();

  let start: Date;
  let end: Date;
  let bucket: ChartBucket;

  switch (key) {
    case "last-month": {
      start = new Date(y, m - 1, 1);
      end = new Date(y, m, 0);
      bucket = "day";
      break;
    }
    case "last-3-months": {
      end = today;
      start = addDays(end, -89);
      bucket = "week";
      break;
    }
    case "this-year": {
      start = new Date(y, 0, 1);
      end = today;
      bucket = "month";
      break;
    }
    case "this-month":
    default: {
      start = new Date(y, m, 1);
      end = today;
      bucket = "day";
      break;
    }
  }

  const length = daysBetween(start, end) + 1;

  return {
    key,
    label: FINANCE_PERIOD_OPTIONS.find((p) => p.key === key)?.label ?? "",
    rangeLabel: formatDateRange(start, end),
    start,
    end,
    prevStart: addDays(start, -length),
    prevEnd: addDays(start, -1),
    bucket,
  };
}

/** "1–29 Agustus 2026" atau "30 Mei – 29 Agustus 2026". */
export function formatDateRange(start: Date, end: Date): string {
  const sameMonth =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.getDate()}–${end.getDate()} ${end.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`;
  }

  const startStr = start.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: start.getFullYear() !== end.getFullYear() ? "numeric" : undefined,
  });
  const endStr = end.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

/* ------------------------------------------------------------------ */
/* Formatter                                                           */
/* ------------------------------------------------------------------ */

export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format singkat untuk sumbu grafik: "Rp12jt", "Rp800rb". */
export function formatCompactIDR(value: number): string {
  if (value >= 1_000_000_000)
    return `Rp${(value / 1_000_000_000).toFixed(1).replace(".", ",")}M`;
  if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(0)}jt`;
  if (value >= 1_000) return `Rp${(value / 1_000).toFixed(0)}rb`;
  return `Rp${value}`;
}

/** "+12,4%" / "-3,2%" dengan koma desimal ala Indonesia. */
export function formatPercent(value: number, decimals = 1): string {
  const formatted = Math.abs(value).toLocaleString("id-ID", {
    maximumFractionDigits: decimals,
  });
  return `${value >= 0 ? "+" : "-"}${formatted}%`;
}

/* ------------------------------------------------------------------ */
/* Ringkasan & agregasi                                                */
/* ------------------------------------------------------------------ */

export interface FinanceSummary {
  income: number;
  expense: number;
  net: number;
  incomeChange: number | null;
  expenseChange: number | null;
  netChange: number | null;
}

/**
 * Ringkasan keuangan untuk satu periode.
 *
 * Definisi angka yang KONSISTEN dengan halaman Dashboard:
 * - Pendapatan = total penjualan kasir (`sales`) + pemasukan manual.
 * - Pengeluaran = pengeluaran manual (TransaksiKeuangan tipe expense).
 * `sales` berbentuk [{ date: "yyyy-mm-dd", total }] (tanggal UTC createdAt).
 */
export function summarizeTransactions(
  transactions: FinanceTransaction[],
  period: FinancePeriod,
  sales: { date: string; total: number }[] = [],
): FinanceSummary {
  const startISO = toISODate(period.start);
  const endISO = toISODate(period.end);
  const prevStartISO = toISODate(period.prevStart);
  const prevEndISO = toISODate(period.prevEnd);

  let income = 0;
  let expense = 0;
  let prevIncome = 0;
  let prevExpense = 0;

  for (const t of transactions) {
    if (t.date >= startISO && t.date <= endISO) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    } else if (t.date >= prevStartISO && t.date <= prevEndISO) {
      if (t.type === "income") prevIncome += t.amount;
      else prevExpense += t.amount;
    }
  }

  // Penjualan kasir dihitung sebagai pendapatan toko.
  for (const s of sales) {
    if (s.date >= startISO && s.date <= endISO) {
      income += s.total;
    } else if (s.date >= prevStartISO && s.date <= prevEndISO) {
      prevIncome += s.total;
    }
  }

  const pctChange = (current: number, previous: number): number | null =>
    previous === 0 ? null : ((current - previous) / previous) * 100;

  return {
    income,
    expense,
    net: income - expense,
    incomeChange: pctChange(income, prevIncome),
    expenseChange: pctChange(expense, prevExpense),
    netChange: pctChange(income - expense, prevIncome - prevExpense),
  };
}

export interface ExpenseCategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

/** Pengeluaran per kategori pada periode, diurutkan dari yang terbesar. */
export function breakdownExpenses(
  transactions: FinanceTransaction[],
  period: FinancePeriod,
): ExpenseCategoryBreakdown[] {
  const startISO = toISODate(period.start);
  const endISO = toISODate(period.end);

  const totals = new Map<string, number>();
  let total = 0;

  for (const t of transactions) {
    if (t.type !== "expense") continue;
    if (t.date < startISO || t.date > endISO) continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
    total += t.amount;
  }

  return Array.from(totals.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

/* ------------------------------------------------------------------ */
/* Data grafik Pendapatan vs Pengeluaran                               */
/* ------------------------------------------------------------------ */

export interface FinanceChartPoint {
  key: string;
  /** Label pendek sumbu X ("29 Agu", "1–7 Agu", "Agu"). */
  label: string;
  /** Label lengkap untuk tooltip ("29 Agustus 2026"). */
  fullLabel: string;
  pendapatan: number;
  pengeluaran: number;
  laba: number;
  /** Target pendapatan pada titik ini (proporsional dari target bulanan). */
  target: number;
}

/* ------------------------------------------------------------------ */
/* Target pendapatan — dibagi proporsional per bucket grafik.          */
/* Dipakai konsisten di dashboard (SalesChart) dan keuangan.           */
/* ------------------------------------------------------------------ */

/** Rata-rata hari per bulan untuk membagi target bulanan. */
export const DAYS_PER_MONTH = 30.44;

/**
 * Porsi target bulanan untuk satu bucket grafik:
 * - day   → target per hari
 * - week  → target per minggu
 * - month → target bulanan penuh
 */
export function proratedTarget(
  monthlyTarget: number,
  bucket: ChartBucket,
): number {
  const factor =
    bucket === "day" ? 1 / DAYS_PER_MONTH : bucket === "week" ? 7 / DAYS_PER_MONTH : 1;
  return Math.round(monthlyTarget * factor);
}

export function buildFinanceChartData(
  transactions: FinanceTransaction[],
  period: FinancePeriod,
  monthlyTarget = 0,
  sales: { date: string; total: number }[] = [],
): FinanceChartPoint[] {
  const points: FinanceChartPoint[] = [];
  const bucketRanges: { start: string; end: string; index: number }[] = [];

  if (period.bucket === "day") {
    for (
      let d = new Date(period.start);
      d <= period.end;
      d.setDate(d.getDate() + 1)
    ) {
      const iso = toISODate(d);
      bucketRanges.push({ start: iso, end: iso, index: points.length });
      points.push({
        key: iso,
        label: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        fullLabel: d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        pendapatan: 0,
        pengeluaran: 0,
        laba: 0,
        target: proratedTarget(monthlyTarget, "day"),
      });
    }
  } else if (period.bucket === "week") {
    let weekStart = new Date(period.start);
    while (weekStart <= period.end) {
      const weekEnd = addDays(weekStart, 6);
      const clampedEnd = weekEnd <= period.end ? weekEnd : new Date(period.end);
      bucketRanges.push({
        start: toISODate(weekStart),
        end: toISODate(clampedEnd),
        index: points.length,
      });
      points.push({
        key: toISODate(weekStart),
        label: `${weekStart.getDate()}–${clampedEnd.getDate()} ${clampedEnd.toLocaleDateString("id-ID", { month: "short" })}`,
        fullLabel: `${weekStart.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} – ${clampedEnd.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`,
        pendapatan: 0,
        pengeluaran: 0,
        laba: 0,
        target: proratedTarget(monthlyTarget, "week"),
      });
      weekStart = addDays(weekStart, 7);
    }
  } else {
    let monthStart = new Date(
      period.start.getFullYear(),
      period.start.getMonth(),
      1,
    );
    while (monthStart <= period.end) {
      const monthEnd = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 1,
        0,
      );
      bucketRanges.push({
        start: toISODate(monthStart),
        end: toISODate(monthEnd),
        index: points.length,
      });
      points.push({
        key: toISODate(monthStart),
        label: monthStart.toLocaleDateString("id-ID", { month: "short" }),
        fullLabel: monthStart.toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        }),
        pendapatan: 0,
        pengeluaran: 0,
        laba: 0,
        target: proratedTarget(monthlyTarget, "month"),
      });
      monthStart = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 1,
        1,
      );
    }
  }

  const startISO = toISODate(period.start);
  const endISO = toISODate(period.end);

  for (const t of transactions) {
    if (t.date < startISO || t.date > endISO) continue;
    const bucket = bucketRanges.find(
      (r) => t.date >= r.start && t.date <= r.end,
    );
    if (!bucket) continue;
    const point = points[bucket.index];
    if (t.type === "income") point.pendapatan += t.amount;
    else point.pengeluaran += t.amount;
  }

  // Penjualan kasir ikut dihitung sebagai pendapatan (konsisten dengan
  // dashboard).
  for (const s of sales) {
    if (s.date < startISO || s.date > endISO) continue;
    const bucket = bucketRanges.find(
      (r) => s.date >= r.start && s.date <= r.end,
    );
    if (!bucket) continue;
    points[bucket.index].pendapatan += s.total;
  }

  for (const point of points) {
    point.laba = point.pendapatan - point.pengeluaran;
  }

  return points;
}

/* ------------------------------------------------------------------ */
/* Data dummy — ganti dengan data API asli nanti                       */
/* ------------------------------------------------------------------ */

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const MOCK_INCOME_PATTERNS: { description: string; category: string }[] = [
  { description: "Penjualan Toko", category: "Penjualan" },
  { description: "Penjualan Marketplace", category: "Pesanan Online" },
  { description: "Pesanan Grosir", category: "Penjualan" },
  { description: "Jasa Antar Pesanan", category: "Jasa" },
  { description: "Penjualan Online", category: "Pesanan Online" },
];

/**
 * Membuat riwayat transaksi deterministik (±20 bulan) dengan pola UMKM:
 * pendapatan harian yang naik pelan, stok sebagai pengeluaran terbesar,
 * gaji & sewa tiap awal bulan, serta pengeluaran operasional rutin.
 */
export function createMockTransactions(now = new Date()): FinanceTransaction[] {
  const rand = seededRandom(20260829);
  const today = startOfDay(now);
  // Mulai dari Januari tahun lalu supaya pembanding "Tahun Ini" terisi.
  const start = new Date(now.getFullYear() - 1, 0, 1);
  const monthsFromStart = (d: Date) =>
    (d.getFullYear() - start.getFullYear()) * 12 +
    (d.getMonth() - start.getMonth());

  const transactions: FinanceTransaction[] = [];
  let id = 1;

  for (
    const d = new Date(start);
    d <= today;
    d.setDate(d.getDate() + 1)
  ) {
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const dayOfMonth = d.getDate();
    const iso = toISODate(d);
    // Tren naik pelan supaya perbandingan antar periode terlihat wajar.
    const drift = 1 + monthsFromStart(d) * 0.02;

    const push = (tx: Omit<FinanceTransaction, "id">) => {
      transactions.push({ id: `mock-${id++}`, ...tx });
    };

    // Pendapatan harian
    const incomeCount = weekend
      ? 3 + Math.floor(rand() * 2)
      : 2 + Math.floor(rand() * 2);
    for (let i = 0; i < incomeCount; i++) {
      const pattern =
        MOCK_INCOME_PATTERNS[Math.floor(rand() * MOCK_INCOME_PATTERNS.length)];
      const base = weekend
        ? 400_000 + Math.floor(rand() * 1_100_000)
        : 250_000 + Math.floor(rand() * 800_000);
      push({
        type: "income",
        description: pattern.description,
        amount: Math.floor(base * drift),
        category: pattern.category,
        date: iso,
      });
    }

    // Pengeluaran rutin
    if (dayOfMonth === 1) {
      push({
        type: "expense",
        description: "Gaji Karyawan",
        amount: 4_400_000 + Math.floor(rand() * 400_000),
        category: "Gaji",
        date: iso,
        note: "2 karyawan tetap",
      });
      push({
        type: "expense",
        description: "Sewa Tempat Usaha",
        amount: 2_500_000,
        category: "Operasional",
        date: iso,
      });
    }
    if (dayOfMonth === 5) {
      push({
        type: "expense",
        description: "Listrik & Air",
        amount: 550_000 + Math.floor(rand() * 300_000),
        category: "Operasional",
        date: iso,
      });
    }
    if (dayOfMonth === 10) {
      push({
        type: "expense",
        description: "Kebersihan & Keamanan",
        amount: 200_000 + Math.floor(rand() * 100_000),
        category: "Operasional",
        date: iso,
      });
    }
    if (dayOfMonth === 15) {
      push({
        type: "expense",
        description: "Internet & Wifi",
        amount: 320_000 + Math.floor(rand() * 80_000),
        category: "Operasional",
        date: iso,
      });
    }
    if (dayOfMonth === 20) {
      push({
        type: "expense",
        description: "Pajak & Retribusi",
        amount: 350_000 + Math.floor(rand() * 150_000),
        category: "Operasional",
        date: iso,
      });
    }
    if (dayOfMonth % 4 === 0) {
      push({
        type: "expense",
        description: "Restok Barang Dagangan",
        amount: 2_200_000 + Math.floor(rand() * 1_300_000),
        category: "Stok",
        date: iso,
      });
    }
    if (dayOfMonth % 7 === 3) {
      push({
        type: "expense",
        description: "Belanja Bahan Baku",
        amount: 600_000 + Math.floor(rand() * 900_000),
        category: "Stok",
        date: iso,
      });
    }
    if (dayOfMonth % 9 === 2) {
      push({
        type: "expense",
        description: "Kemasan & Label",
        amount: 150_000 + Math.floor(rand() * 150_000),
        category: "Lainnya",
        date: iso,
      });
    }
    if (d.getDay() === 0) {
      push({
        type: "expense",
        description: "Restok Mingguan",
        amount: 1_500_000 + Math.floor(rand() * 1_000_000),
        category: "Stok",
        date: iso,
      });
    }
    if (rand() < 0.05) {
      push({
        type: "expense",
        description: "Perbaikan & Perawatan Peralatan",
        amount: 200_000 + Math.floor(rand() * 800_000),
        category: "Lainnya",
        date: iso,
      });
    }
  }

  return transactions;
}
