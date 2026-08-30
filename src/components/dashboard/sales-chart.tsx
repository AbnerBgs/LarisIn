'use client'
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { RiArrowDownSLine, RiArrowUpLine, RiArrowDownLine } from '@remixicon/react';

type PeriodKey = '30d' | '3m' | '3y';

interface DataPoint {
  label: string;
  fullLabel: string;
  revenue: number;
  target: number;
}

interface PeriodConfig {
  key: PeriodKey;
  label: string;
  build: () => DataPoint[];
}

interface Stats {
  total: number;
  avg: number;
  growth: number;
}

interface SalesChartProps {
  month?: string;
}

// ---------------------------------------------------------------------------
// Data dummy
// ---------------------------------------------------------------------------
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateDaily(days: number): DataPoint[] {
  const rand = seededRandom(42);
  const out: DataPoint[] = [];
  const today = new Date();
  let base = 8_000_000;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const noise = (rand() - 0.5) * 3_000_000;
    base += (rand() - 0.45) * 250_000;
    const revenue = Math.max(1_000_000, base + noise + (weekend ? 1_500_000 : 0));
    out.push({
      label: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      fullLabel: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      revenue: Math.round(revenue),
      target: Math.round(base + 2_000_000),
    });
  }
  return out;
}

function generateWeekly(weeks: number): DataPoint[] {
  const rand = seededRandom(7);
  const out: DataPoint[] = [];
  const today = new Date();
  let base = 55_000_000;
  for (let i = weeks - 1; i >= 0; i--) {
    const end = new Date(today);
    end.setDate(end.getDate() - i * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    base += (rand() - 0.4) * 4_000_000;
    const revenue = Math.max(10_000_000, base + (rand() - 0.5) * 8_000_000);
    out.push({
      label: `${start.getDate()}–${end.getDate()} ${end.toLocaleDateString('id-ID', { month: 'short' })}`,
      fullLabel: `${start.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} – ${end.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`,
      revenue: Math.round(revenue),
      target: Math.round(base + 6_000_000),
    });
  }
  return out;
}

function generateMonthly(months: number): DataPoint[] {
  const rand = seededRandom(123);
  const out: DataPoint[] = [];
  const today = new Date();
  let base = 220_000_000;
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const seasonal = Math.sin((d.getMonth() / 12) * Math.PI * 2) * 20_000_000;
    base += (rand() - 0.35) * 12_000_000;
    const revenue = Math.max(50_000_000, base + seasonal + (rand() - 0.5) * 15_000_000);
    out.push({
      label: d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
      fullLabel: d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      revenue: Math.round(revenue),
      target: Math.round(base + seasonal + 25_000_000),
    });
  }
  return out;
}

const PERIODS: PeriodConfig[] = [
  { key: '30d', label: '30 hari terakhir', build: () => generateDaily(30) },
  { key: '3m', label: '3 bulan terakhir', build: () => generateWeekly(13) },
  { key: '3y', label: '3 tahun terakhir', build: () => generateMonthly(36) },
];

// ---------------------------------------------------------------------------
// Util
// ---------------------------------------------------------------------------
const formatCompact = (v: number): string => {
  if (v >= 1_000_000_000) return `Rp${(v / 1_000_000_000).toFixed(1)}M`;
  if (v >= 1_000_000) return `Rp${(v / 1_000_000).toFixed(0)}jt`;
  if (v >= 1_000) return `Rp${(v / 1_000).toFixed(0)}rb`;
  return `Rp${v}`;
};

const formatFull = (v: number): string =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

interface TooltipEntry {
  dataKey: string;
  value: number;
  payload: DataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const revenue = payload.find((p) => p.dataKey === 'revenue')?.value;
  const target = payload.find((p) => p.dataKey === 'target')?.value;
  const diff = revenue != null && target != null ? revenue - target : null;
  const full = payload[0]?.payload?.fullLabel ?? label;

  return (
    <div className="rounded-lg border hard-shadow-static bg-white px-3.5 py-2.5 shadow-lg shadow-slate-900/5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-1.5">{full}</p>
      {revenue != null && (
        <div className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-teal-600" />
          <span className="text-slate-500">Penjualan</span>
          <span className="ml-auto font-mono font-medium text-slate-800">{formatFull(revenue)}</span>
        </div>
      )}
      {target != null && (
        <div className="flex items-center gap-2 text-sm mt-1">
          <span className="h-2 w-2 rounded-full border-2 border-amber-500 bg-white" />
          <span className="text-slate-500">Target</span>
          <span className="ml-auto font-mono font-medium text-slate-800">{formatFull(target)}</span>
        </div>
      )}
      {diff != null && (
        <p className={`mt-1.5 pt-1.5 border-t border-slate-100 text-xs font-medium ${diff >= 0 ? 'text-teal-600' : 'text-rose-500'}`}>
          {diff >= 0 ? '▲' : '▼'} {formatFull(Math.abs(diff))} {diff >= 0 ? 'di atas target' : 'di bawah target'}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dropdown
// ---------------------------------------------------------------------------
interface PeriodDropdownProps {
  value: PeriodKey;
  onChange: (key: PeriodKey) => void;
}

function PeriodDropdown({ value, onChange }: PeriodDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = PERIODS.find((p) => p.key === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border hard-shadow bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current?.label}
        <RiArrowDownSLine className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 z-20 mt-1.5 w-48 overflow-hidden rounded-lg border hard-shadow-static bg-white py-1 shadow-lg shadow-slate-900/10"
        >
          {PERIODS.map((p) => (
            <li key={p.key}>
              <button
                type="button"
                role="option"
                aria-selected={p.key === value}
                onClick={() => {
                  onChange(p.key);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-sm text-left transition-colors ${
                  p.key === value ? 'bg-teal-50 text-teal-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Komponen utama
// ---------------------------------------------------------------------------
export default function SalesChart({ month = "Agustus" }: SalesChartProps) {
  const [period, setPeriod] = useState<PeriodKey>('30d');

  const data = useMemo<DataPoint[]>(
    () => PERIODS.find((p) => p.key === period)!.build(),
    [period]
  );

  const stats = useMemo<Stats>(() => {
    const total = data.reduce((s, d) => s + d.revenue, 0);
    const avg = total / data.length;
    const half = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, half).reduce((s, d) => s + d.revenue, 0) / (half || 1);
    const secondHalf = data.slice(half).reduce((s, d) => s + d.revenue, 0) / (data.length - half || 1);
    const growth = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;
    return { total, avg, growth };
  }, [data]);

  const isUp = stats.growth >= 0;

  return (
    <div className="w-full mx-auto rounded-2xl p-5 sm:p-6 font-sans">
      {/* Header: dropdown kiri atas + ringkasan */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-1">
        <div>
          <PeriodDropdown value={period} onChange={setPeriod} />
          <p className="mt-2.5 text-xs uppercase tracking-wide text-slate-400">
            Total penjualan ({month})
          </p>
          <p className="font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
            {formatFull(stats.total)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 pt-1">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              isUp ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-600'
            }`}
          >
            {isUp ? <RiArrowUpLine className="h-3.5 w-3.5" /> : <RiArrowDownLine className="h-3.5 w-3.5" />}
            {isUp ? '+' : ''}
            {stats.growth.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-400">vs paruh awal periode</span>
        </div>
      </div>

      {/* Legend ringkas */}
      <div className="flex items-center gap-4 mt-4 mb-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-teal-600" /> Penjualan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border-2 border-amber-500 bg-white" /> Target
        </span>
        <span className="text-slate-400 ml-auto">
          Rata-rata: <span className="font-mono text-slate-600">{formatCompact(stats.avg)}</span>
        </span>
      </div>

      {/* Chart */}
      <div className="h-72 sm:h-80 mt-2 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 6" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCompact}
              width={56}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0d9488"
              strokeWidth={2}
              fill="url(#revenueFill)"
              dot={false}
              activeDot={{ r: 5, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#d97706"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4, fill: '#d97706', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}