"use client";

// Halaman Keuangan — ringkasan, grafik, rincian pengeluaran, laba & rugi,
// transaksi terbaru, dan insight bisnis. Semua angka diturunkan dari satu
// state `transactions`, jadi transaksi baru langsung memperbarui seluruh
// halaman. Data diambil dari database lewat API /api/finance.

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiAddLine,
  RiArrowDownCircleLine,
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiArrowUpCircleLine,
  RiArrowUpLine,
  RiBox3Line,
  RiCheckLine,
  RiFlagLine,
  RiMoneyDollarCircleLine,
  RiMore2Line,
  RiPercentLine,
  RiStockLine,
  RiTeamLine,
  RiToolsLine,
} from "@remixicon/react";
import AddTransactionDialog from "@/components/dashboard/add-transaction-dialog";
import FinanceChart from "@/components/dashboard/finance-chart";
import TargetDialog from "@/components/dashboard/target-dialog";
import {
  breakdownExpenses,
  buildFinanceChartData,
  DAYS_PER_MONTH,
  FINANCE_PERIOD_OPTIONS,
  formatIDR,
  formatPercent,
  formatTxDate,
  getFinancePeriod,
  summarizeTransactions,
  toISODate,
  type FinancePeriodKey,
  type FinanceTransaction,
  type NewFinanceTransaction,
} from "@/lib/finance";

/* ------------------------------------------------------------------ */
/* Meta tampilan kategori pengeluaran                                  */
/* ------------------------------------------------------------------ */

const CATEGORY_META: Record<
  string,
  { icon: RemixiconComponentType; tile: string; bar: string }
> = {
  Stok: { icon: RiBox3Line, tile: "bg-blue-50 text-blue-600", bar: "bg-blue-500" },
  Operasional: { icon: RiToolsLine, tile: "bg-amber-50 text-amber-600", bar: "bg-amber-500" },
  Gaji: { icon: RiTeamLine, tile: "bg-teal-50 text-teal-600", bar: "bg-teal-500" },
  Lainnya: { icon: RiMore2Line, tile: "bg-slate-100 text-slate-600", bar: "bg-slate-400" },
};

const FALLBACK_CATEGORY_META = {
  icon: RiMore2Line,
  tile: "bg-slate-100 text-slate-600",
  bar: "bg-slate-400",
};

/* ------------------------------------------------------------------ */
/* Selektor periode (dropdown)                                         */
/* ------------------------------------------------------------------ */

function PeriodSelect({
  value,
  onChange,
}: {
  value: FinancePeriodKey;
  onChange: (key: FinancePeriodKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const current = FINANCE_PERIOD_OPTIONS.find((p) => p.key === value);

  // Tutup saat klik di luar dropdown.
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && !open) {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() =>
        listRef.current?.querySelector("button")?.focus(),
      );
    } else if (e.key === "Escape" && open) {
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    e.preventDefault();

    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? [],
    );
    if (items.length === 0) return;

    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    let next: number;
    if (e.key === "ArrowDown") next = index < 0 ? 0 : Math.min(index + 1, items.length - 1);
    else if (e.key === "ArrowUp") next = index < 0 ? items.length - 1 : Math.max(index - 1, 0);
    else if (e.key === "Home") next = 0;
    else next = items.length - 1;
    items[next].focus();
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Periode: ${current?.label}`}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        {current?.label}
        <RiArrowDownSLine
          size={16}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Pilih periode"
          onKeyDown={handleListKeyDown}
          className="absolute right-0 z-20 mt-1.5 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg shadow-slate-900/10"
        >
          {FINANCE_PERIOD_OPTIONS.map((option) => {
            const selected = option.key === value;
            return (
              <li key={option.key}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option.key);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-sm text-left transition-colors ${
                    selected
                      ? "bg-blue-50 font-medium text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                  {selected && <RiCheckLine size={16} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Baris Laba & Rugi                                                   */
/* ------------------------------------------------------------------ */

function PnLRow({
  label,
  amount,
  strong = false,
}: {
  label: string;
  amount: number;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 py-2.5 ${
        strong ? "mt-1 border-t border-dashed border-black/20 pt-3" : ""
      }`}
    >
      <dt
        className={`text-sm ${
          strong ? "font-semibold text-gray-900" : "text-gray-600"
        }`}
      >
        {label}
      </dt>
      <dd
        className={`font-mono text-sm font-semibold tabular-nums ${
          amount >= 0 ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {amount >= 0 ? "+" : "-"}
        {formatIDR(Math.abs(amount))}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Kartu target pendapatan (dapat diklik)                              */
/* ------------------------------------------------------------------ */

function TargetCard({
  monthlyTarget,
  periodIncome,
  periodDays,
  onOpen,
}: {
  monthlyTarget: number;
  periodIncome: number;
  periodDays: number;
  onOpen: () => void;
}) {
  const periodTarget =
    monthlyTarget > 0 ? (monthlyTarget * periodDays) / DAYS_PER_MONTH : 0;
  const progressPct =
    periodTarget > 0 ? Math.round((periodIncome / periodTarget) * 100) : 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Atur target pendapatan"
      className="cursor-pointer rounded-2xl border border-gray-200 bg-white text-left transition-colors hover:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
    >
      <div className="flex items-start justify-between p-4 pb-3">
        <span className="text-xs font-medium text-gray-600">
          Target Pendapatan
        </span>
        <RiFlagLine size={20} className="text-gray-500" />
      </div>
      <div className="rounded-b-2xl rounded-xl border border-black hard-shadow bg-indigo-100 p-4">
        <p className="font-mono text-xl font-bold tabular-nums text-indigo-900">
          {monthlyTarget > 0 ? formatIDR(monthlyTarget) : "Belum diatur"}
        </p>
        {monthlyTarget > 0 ? (
          <>
            <p className="mt-1.5 font-mono text-xs text-indigo-700">
              {progressPct}% tercapai periode ini
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-indigo-200">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${Math.min(100, progressPct)}%` }}
              />
            </div>
          </>
        ) : (
          <p className="mt-1.5 font-mono text-xs text-indigo-700">
            Klik untuk mengatur target
          </p>
        )}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */

export default function FinancePage() {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodKey, setPeriodKey] = useState<FinancePeriodKey>("this-month");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetOpen, setTargetOpen] = useState(false);
  const [monthlyTarget, setMonthlyTarget] = useState(0);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  // Muat transaksi dari database (API /api/finance).
  // Dengarkan juga event "finance-updated" yang dikirim navbar saat
  // transaksi baru dibuat lewat dialog "Buat Baru".
  const loadTransactions = useCallback(() => {
    fetch("/api/finance")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat transaksi");
        return res.json();
      })
      .then((data) => {
        setTransactions(data.transactions ?? []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setTransactions([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadTransactions();
    const handler = () => loadTransactions();
    window.addEventListener("finance-updated", handler);
    return () => window.removeEventListener("finance-updated", handler);
  }, [loadTransactions]);

  // Muat target pendapatan bulanan dari database.
  const loadTarget = useCallback(() => {
    fetch("/api/target")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat target");
        return res.json();
      })
      .then((data) => {
        setMonthlyTarget(Number(data.amount) || 0);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    loadTarget();
  }, [loadTarget]);

  const period = useMemo(() => getFinancePeriod(periodKey), [periodKey]);
  const summary = useMemo(
    () => summarizeTransactions(transactions, period),
    [transactions, period],
  );
  const breakdown = useMemo(
    () => breakdownExpenses(transactions, period),
    [transactions, period],
  );
  const chartData = useMemo(
    () => buildFinanceChartData(transactions, period, monthlyTarget),
    [transactions, period, monthlyTarget],
  );

  const recentTransactions = useMemo(() => {
    const startISO = toISODate(period.start);
    const endISO = toISODate(period.end);
    return transactions
      .filter((t) => t.date >= startISO && t.date <= endISO)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, period]);

  const visibleTransactions = showAllTransactions
    ? recentTransactions
    : recentTransactions.slice(0, 6);

  // Laba & rugi: HPP diasumsikan pengeluaran kategori Stok.
  const hpp = breakdown.find((b) => b.category === "Stok")?.amount ?? 0;
  const grossProfit = summary.income - hpp;
  const operatingExpense = summary.expense - hpp;

  // Panjang periode terpilih (hari) — dipakai kartu target untuk
  // memprorata target bulanan.
  const periodDays =
    Math.round((period.end.getTime() - period.start.getTime()) / 86_400_000) +
    1;

  const handlePeriodChange = (key: FinancePeriodKey) => {
    setPeriodKey(key);
    setShowAllTransactions(false);
  };

  const handleSaveTarget = async (amount: number) => {
    try {
      const res = await fetch("/api/target", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Gagal menyimpan target");
      }

      const data = await res.json();
      setMonthlyTarget(Number(data.amount) || 0);
      setTargetOpen(false);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Gagal menyimpan target",
      );
    }
  };

  const handleAddTransaction = async (input: NewFinanceTransaction) => {
    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Gagal menyimpan transaksi");
      }

      const data = await res.json();
      if (data.transaction) {
        setTransactions((prev) => [data.transaction, ...prev]);
      }
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan transaksi",
      );
    }
  };

  const summaryCards: {
    label: string;
    value: number;
    change: number | null;
    goodWhenUp: boolean;
    icon: RemixiconComponentType;
    bg: string;
    valueColor: string;
  }[] = [
    {
      label: "Pendapatan",
      value: summary.income,
      change: summary.incomeChange,
      goodWhenUp: true,
      icon: RiArrowUpCircleLine,
      bg: "bg-emerald-100",
      valueColor: "text-emerald-900",
    },
    {
      label: "Pengeluaran",
      value: summary.expense,
      change: summary.expenseChange,
      goodWhenUp: false,
      icon: RiArrowDownCircleLine,
      bg: "bg-rose-100",
      valueColor: "text-rose-900",
    },
    {
      label: "Laba Bersih",
      value: summary.net,
      change: summary.netChange,
      goodWhenUp: true,
      icon: RiMoneyDollarCircleLine,
      bg: "bg-blue-100",
      valueColor: "text-blue-900",
    },
  ];

  const insights = useMemo(() => {
    const prevLabel =
      periodKey === "this-month" ? "bulan lalu" : "periode sebelumnya";
    const periodLabel = periodKey === "this-month" ? "bulan ini" : "periode ini";
    const result: {
      id: string;
      icon: RemixiconComponentType;
      tile: string;
      text: ReactNode;
    }[] = [];

    if (summary.incomeChange !== null) {
      const up = summary.incomeChange >= 0;
      result.push({
        id: "income-trend",
        icon: RiStockLine,
        tile: up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600",
        text: (
          <>
            Pendapatan {up ? "meningkat" : "menurun"}{" "}
            <strong>{formatPercent(summary.incomeChange)}</strong> dibanding{" "}
            {prevLabel}.
          </>
        ),
      });
    }

    const topExpense = breakdown[0];
    if (topExpense && topExpense.amount > 0) {
      result.push({
        id: "top-expense",
        icon: RiBox3Line,
        tile: "bg-blue-50 text-blue-600",
        text: (
          <>
            <strong>{topExpense.category}</strong> menjadi pengeluaran terbesar{" "}
            {periodLabel} dengan porsi{" "}
            <strong>
              {topExpense.percentage.toLocaleString("id-ID", {
                maximumFractionDigits: 0,
              })}
              %
            </strong>{" "}
            dari total pengeluaran.
          </>
        ),
      });
    }

    if (summary.income > 0) {
      const margin = (summary.net / summary.income) * 100;
      if (summary.net >= 0) {
        const verdict =
          margin >= 30
            ? "sangat sehat"
            : margin >= 15
              ? "sehat"
              : margin >= 5
                ? "cukup ketat"
                : "perlu perhatian";
        result.push({
          id: "margin",
          icon: RiPercentLine,
          tile: "bg-amber-50 text-amber-600",
          text: (
            <>
              Margin laba bersih Anda sebesar{" "}
              <strong>
                {margin.toLocaleString("id-ID", {
                  maximumFractionDigits: 1,
                })}
                %
              </strong>{" "}
              dari pendapatan — {verdict}.
            </>
          ),
        });
      } else {
        result.push({
          id: "negative-net",
          icon: RiPercentLine,
          tile: "bg-rose-50 text-rose-600",
          text: (
            <>
              Pengeluaran melebihi pendapatan pada {periodLabel} — periksa
              kembali arus kas Anda.
            </>
          ),
        });
      }
    }

    return result;
  }, [summary, breakdown, periodKey]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
        {/* 1. Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
              Keuangan
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola dan pantau kesehatan keuangan bisnis Anda.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PeriodSelect value={periodKey} onChange={handlePeriodChange} />
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-black bg-amber-300 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-amber-400 hard-shadow"
            >
              <RiAddLine size={16} />
              Tambah Transaksi
            </button>
          </div>
        </div>

        {/* 2. Kartu ringkasan */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            const good = (card.change ?? 0) >= 0 === card.goodWhenUp;
            return (
              <div
                key={card.label}
                className="rounded-2xl border border-gray-200 bg-white"
              >
                <div className="flex items-start justify-between p-4 pb-3">
                  <span className="text-xs font-medium text-gray-600">
                    {card.label}
                  </span>
                  <Icon size={20} className="text-gray-500" />
                </div>
                <div className={`rounded-b-2xl p-4 rounded-xl border border-black hard-shadow ${card.bg}`}>
                  <p
                    className={`font-mono text-xl font-bold tabular-nums md:text-2xl ${card.valueColor}`}
                  >
                    {formatIDR(card.value)}
                  </p>
                  {card.change !== null ? (
                    <p
                      className={`mt-1.5 flex flex-wrap items-center gap-1 font-mono text-xs ${
                        good ? "text-emerald-700" : "text-rose-600"
                      }`}
                    >
                      {card.change >= 0 ? (
                        <RiArrowUpLine size={13} />
                      ) : (
                        <RiArrowDownLine size={13} />
                      )}
                      <span className="font-semibold">
                        {formatPercent(card.change)}
                      </span>
                      <span className="text-gray-500">
                        dibanding periode sebelumnya
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1.5 font-mono text-xs text-gray-500">
                      Belum ada data pembanding
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Kartu Target Pendapatan — klik untuk mengatur target */}
          <TargetCard
            monthlyTarget={monthlyTarget}
            periodIncome={summary.income}
            periodDays={periodDays}
            onOpen={() => setTargetOpen(true)}
          />
        </div>

        {/* 3. Grafik Pendapatan vs Pengeluaran */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-black bg-white hard-shadow-static">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Pendapatan vs Pengeluaran
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Arus kas {period.rangeLabel}
              </p>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
              {period.label}
            </span>
          </div>
          <FinanceChart data={chartData} />
        </section>

        {/* 4. Rincian pengeluaran + Laba & Rugi */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border border-black bg-white hard-shadow-static">
            <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  Rincian Pengeluaran
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  {period.rangeLabel}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-gray-900">
                  {formatIDR(summary.expense)}
                </p>
                <p className="text-[11px] text-gray-400">Total</p>
              </div>
            </div>
            <ul className="space-y-4 px-5 py-5">
              {breakdown.length === 0 ? (
                <li className="text-sm text-gray-500">
                  Belum ada pengeluaran pada periode ini.
                </li>
              ) : (
                breakdown.map((item) => {
                  const meta = CATEGORY_META[item.category] ?? FALLBACK_CATEGORY_META;
                  const Icon = meta.icon;
                  return (
                    <li key={item.category}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.tile}`}
                          >
                            <Icon size={16} />
                          </span>
                          <span className="truncate text-sm font-medium text-gray-800">
                            {item.category}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block font-mono text-sm font-semibold text-gray-900">
                            {formatIDR(item.amount)}
                          </span>
                          <span className="block font-mono text-[11px] text-gray-400">
                            {item.percentage.toLocaleString("id-ID", {
                              maximumFractionDigits: 0,
                            })}
                            %
                          </span>
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${meta.bar}`}
                          style={{ width: `${Math.min(100, item.percentage)}%` }}
                        />
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </section>

          <section className="overflow-hidden rounded-2xl border border-black bg-white hard-shadow-static">
            <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
              <h2 className="text-sm font-bold text-gray-900">Laba &amp; Rugi</h2>
              <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
                {period.label}
              </span>
            </div>
            <dl className="px-5 py-3">
              <PnLRow label="Pendapatan" amount={summary.income} />
              <PnLRow label="Harga Pokok Penjualan" amount={-hpp} />
              <PnLRow label="Laba Kotor" amount={grossProfit} strong />
              <PnLRow label="Biaya Operasional" amount={-operatingExpense} />
            </dl>
            <div
              className={`flex items-center justify-between gap-3 border-t border-black/10 px-5 py-3.5 ${
                summary.net >= 0 ? "bg-emerald-50" : "bg-rose-50"
              }`}
            >
              <span className="text-sm font-bold text-gray-900">
                Laba Bersih
              </span>
              <span
                className={`font-mono text-base font-bold tabular-nums ${
                  summary.net >= 0 ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {summary.net >= 0 ? "+" : "-"}
                {formatIDR(Math.abs(summary.net))}
              </span>
            </div>
          </section>
        </div>

        {/* 5. Transaksi terbaru */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-black bg-white hard-shadow-static">
          <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Transaksi Terbaru
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {recentTransactions.length} transaksi · {period.rangeLabel}
              </p>
            </div>
            {recentTransactions.length > 6 && !showAllTransactions && (
              <button
                type="button"
                onClick={() => setShowAllTransactions(true)}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Lihat Semua
                <RiArrowRightLine size={14} />
              </button>
            )}
          </div>

          {loading ? (
            <p className="px-5 py-8 text-center text-sm text-gray-500">
              Memuat transaksi...
            </p>
          ) : recentTransactions.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-500">
              Belum ada transaksi pada periode ini.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {visibleTransactions.map((t) => {
                const income = t.type === "income";
                return (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 px-4 py-3 sm:px-5"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        income
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {income ? (
                        <RiArrowUpCircleLine size={18} />
                      ) : (
                        <RiArrowDownCircleLine size={18} />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {t.description}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {formatTxDate(t.date)} · {t.category}
                      </p>
                    </div>
                    <span
                      className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium sm:inline-flex ${
                        income
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {income ? "Pemasukan" : "Pengeluaran"}
                    </span>
                    <span
                      className={`shrink-0 font-mono text-sm font-semibold tabular-nums ${
                        income ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {income ? "+" : "-"}
                      {formatIDR(t.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* 6. Insight bisnis */}
        <section className="mt-6">
          <h2 className="text-base font-bold text-gray-900 md:text-lg">
            Insight Bisnis
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <article
                  key={insight.id}
                  className="flex items-start gap-3.5 rounded-2xl border border-black bg-white p-5 hard-shadow-static"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${insight.tile}`}
                  >
                    <Icon size={18} />
                  </span>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {insight.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </section>

      {/* Di-mount hanya saat dibuka supaya state dialog selalu bersih. */}
      {dialogOpen && (
        <AddTransactionDialog
          open
          onClose={() => setDialogOpen(false)}
          onSave={handleAddTransaction}
        />
      )}
      {targetOpen && (
        <TargetDialog
          open
          currentTarget={monthlyTarget}
          onClose={() => setTargetOpen(false)}
          onSave={handleSaveTarget}
        />
      )}
    </div>
  );
}
