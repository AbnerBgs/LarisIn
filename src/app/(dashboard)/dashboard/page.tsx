import SalesChart from '@/components/dashboard/SalesChart';
import PleaseReveal from '@/components/ui/please-reveal';
import {
  RiSearchLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiArrowRightUpBoxLine,
  RemixiconComponentType,
  RiCurrencyLine,
  RiMoneyDollarCircleLine,
  RiGroup3Line
} from '@remixicon/react';

type StatCard = {
  label: string;
  value: string;
  change: string;
  bg: string;
  valueColor: string;
  icon: RemixiconComponentType;
};

const stats: StatCard[] = [
  {
    label: 'Total Pendapatan',
    value: 'Rp1.992.300,00',
    change: '+8% dari bulan lalu',
    bg: 'bg-blue-100',
    valueColor: 'text-blue-900',
    icon: RiCurrencyLine
  },
  {
    label: 'Pendapatan Bersih',
    value: 'Rp992.300,00',
    change: '+8% dari bulan lalu',
    bg: 'bg-amber-100',
    valueColor: 'text-amber-900',
    icon: RiMoneyDollarCircleLine,
  },
  {
    label: 'Total Pengunjung',
    value: '199',
    change: '+8% dari bulan lalu',
    bg: 'bg-emerald-100',
    valueColor: 'text-emerald-900',
    icon: RiGroup3Line,
  },
];

const topSales = [
  { name: 'Nasi Goreng', value: 1240 },
  { name: 'Mie Ayam', value: 980 },
  { name: 'Sate Ayam', value: 870 },
  { name: 'Rendang', value: 870 },
  { name: 'Bakso', value: 680 },
  { name: 'Es Teh Manis', value: 620 }, 
  { name: 'Ayam Geprek', value: 540 },
];

const maxSales = Math.max(...topSales.map((item) => item.value));

export default async function () {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
        <PleaseReveal>
          <div>
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
              RINGKASAN
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Berikut adalah ringkasan data secara keseluruhan selama satu
              bulan.
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
                  <div className={`${stat.bg} p-4 rounded-xl border hard-shadow`}>
                    <p className={`text-2xl font-mono font-bold ${stat.valueColor}`}>
                      {stat.value}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs font-mono text-gray-600">
                      <RiArrowRightUpLine size={14} className="text-green-600" />
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
                  PENJUALAN TERATAS
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Berikut adalah barang yang paling laris.
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
                Penjualan Teratas
              </h3>
              <p className="text-xs text-gray-500">Total unit terjual per item</p>
              <SalesChart />
            </div>
          </div>
        </PleaseReveal>
      </section>
    </div>
  );
}
