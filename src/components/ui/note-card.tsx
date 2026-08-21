import { RiMapPin2Line, RiStarFill } from "@remixicon/react";

export interface NotaCardProps {
  storeName: string;
  category: string;
  location: string;
  /** 0–5 */
  rating: number;
  productCount: number;
  jobCount: number;
  status?: "Aktif" | "Nonaktif";
  /** Teks pendek di cap stempel, mis. "Laris\nIn" — pisah baris dengan \n */
  stampLabel?: string;
  className?: string;
}

export function NoteCard({
  storeName,
  category,
  location,
  rating,
  productCount,
  jobCount,
  status = "Aktif",
  stampLabel = "Laris\nIn",
  className = "",
}: NotaCardProps) {
  const statusColor =
    status === "Aktif" ? "text-emerald-600" : "text-slate-500";

  return (
    <div
      className={`relative border border-black rounded-lg overflow-hidden bg-white hard-shadow-static py-6 max-w-sm ${className}`}
    >
      <div className="px-5 pt-1 pb-5">
        <div className="flex justify-between items-center font-mono text-[11px] uppercase tracking-widest text-slate-500 border-b border-dashed border-black/30 pb-3 mb-3">
          <span>Nota Digital · Toko Terdaftar</span>
          <span className={`font-semibold ${statusColor}`}>{status}</span>
        </div>

        <div className="flex justify-between items-start gap-3">
          <div>
            <h4 className="font-display font-bold text-base">{storeName}</h4>
            <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <RiMapPin2Line className="h-3.5 w-3.5" />
              {category} · {location}
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-mono bg-orange-300/25 text-[#1c1b17] font-semibold px-2 py-1 rounded border border-black/20">
            <RiStarFill className="h-3 w-3 text-orange-300" />
            {rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-dashed border-black/30 flex flex-col font-mono text-xs">
          <span>{productCount} produk</span>
          <span className="text-indigo-500 font-semibold">
            {jobCount} lowongan kerja
          </span>
        </div>

        <div className="stamp absolute bottom-4 right-4 h-14 w-14 rounded-full flex items-center justify-center font-display text-[10px] font-bold uppercase tracking-tighter text-center leading-none whitespace-pre-line">
          {stampLabel}
        </div>
      </div>
    </div>
  );
}