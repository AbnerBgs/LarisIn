"use client";

// Grafik Pendapatan vs Pengeluaran untuk halaman Keuangan.
// Data dihitung di halaman (lewat `buildFinanceChartData`), komponen ini
// hanya merender.

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactIDR, formatIDR, type FinanceChartPoint } from "@/lib/finance";

/* ------------------------------------------------------------------ */
/* Tooltip kustom                                                     */
/* ------------------------------------------------------------------ */

interface TooltipEntry {
  dataKey?: string | number;
  value?: number | string;
  payload?: FinanceChartPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  const laba = point.laba;

  return (
    <div className="rounded-lg border hard-shadow-static bg-white px-3.5 py-2.5 shadow-lg shadow-slate-900/5">
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {point.fullLabel}
      </p>
      <div className="flex items-center gap-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-teal-600" />
        <span className="text-slate-500">Pendapatan</span>
        <span className="ml-auto font-mono font-medium text-slate-800">
          {formatIDR(point.pendapatan)}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-rose-500" />
        <span className="text-slate-500">Pengeluaran</span>
        <span className="ml-auto font-mono font-medium text-slate-800">
          {formatIDR(point.pengeluaran)}
        </span>
      </div>
      {point.target > 0 && (
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="h-0 w-2.5 border-t-2 border-dashed border-indigo-500" />
          <span className="text-slate-500">Target</span>
          <span className="ml-auto font-mono font-medium text-slate-800">
            {formatIDR(point.target)}
          </span>
        </div>
      )}
      <p
        className={`mt-1.5 flex items-center gap-1.5 border-t border-slate-100 pt-1.5 text-xs font-medium ${
          laba >= 0 ? "text-teal-600" : "text-rose-500"
        }`}
      >
        <span className="text-slate-400">Selisih</span>
        <span className="ml-auto font-mono">
          {laba >= 0 ? "▲" : "▼"} {formatIDR(Math.abs(laba))}
        </span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Komponen utama                                                     */
/* ------------------------------------------------------------------ */

export default function FinanceChart({
  data,
}: {
  data: FinanceChartPoint[];
}) {
  // Garis target hanya dirender bila ada target yang sudah diatur.
  const hasTarget = data.some((p) => p.target > 0);

  return (
    <div className="w-full p-5 pt-3 sm:p-6 sm:pt-3">
      {/* Legend ringkas */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-teal-600" /> Pendapatan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-rose-500" /> Pengeluaran
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-amber-500" /> Laba Bersih
        </span>
        {hasTarget && (
          <span className="flex items-center gap-1.5">
            <span className="h-0 w-4 border-t-2 border-dashed border-indigo-500" />{" "}
            Target
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="mt-2 h-72 sm:h-80 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
            barGap={2}
          >
            <CartesianGrid
              vertical={false}
              stroke="#e2e8f0"
              strokeDasharray="3 6"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCompactIDR}
              width={56}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
            />
            <Bar
              dataKey="pendapatan"
              fill="#0d9488"
              radius={[4, 4, 0, 0]}
              maxBarSize={26}
            />
            <Bar
              dataKey="pengeluaran"
              fill="#f43f5e"
              radius={[4, 4, 0, 0]}
              maxBarSize={26}
            />
            <Line
              type="monotone"
              dataKey="laba"
              stroke="#d97706"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#d97706", stroke: "#fff", strokeWidth: 2 }}
            />
            {hasTarget && (
              <Line
                type="monotone"
                dataKey="target"
                stroke="#6366f1"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 4, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
