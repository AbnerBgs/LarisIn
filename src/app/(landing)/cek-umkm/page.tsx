"use client";

import { useMemo, useState, useEffect, type ElementType } from "react";
import { OriginButton } from "@/components/ui/origin-button";
import PleasePop from "@/components/ui/please-pop";
import PleaseReveal from "@/components/ui/please-reveal";
import PleaseSelect from "@/components/ui/please-select";
import {
  RiBriefcaseLine,
  RiMapPin2Line,
  RiPaletteLine,
  RiRefreshLine,
  RiRestaurantLine,
  RiSearchLine,
  RiSeedlingLine,
  RiShoppingBagLine,
  RiStarFill,
  RiTimeLine,
  RiToolsLine,
  RiTShirtLine,
  RiUserLocationLine,
  RiWhatsappLine,
  RiAddCircleLine,
} from "@remixicon/react";

/* ------------------------------------------------------------------ */
/* Tipe Data                                                          */
/* ------------------------------------------------------------------ */

type CategoryKey = "kuliner" | "fashion" | "kerajinan" | "jasa" | "pertanian";

interface CatalogProduct {
  id?: string;
  name: string;
  price: number;
  imageUrl?: string;
}

interface JobPosting {
  title: string;
  type: string;
  salary: string;
}

export interface Umkm {
  id: string;
  name: string;
  category: CategoryKey;
  city: string;
  area: string;
  rating: number;
  openHours: string;
  whatsapp: string;
  description: string;
  products: CatalogProduct[];
  jobs: JobPosting[];
}

const CATEGORY_META: Record<
  CategoryKey,
  { label: string; code: string; icon: ElementType }
> = {
  kuliner: { label: "Kuliner", code: "KUL", icon: RiRestaurantLine },
  fashion: { label: "Fashion", code: "FSH", icon: RiTShirtLine },
  kerajinan: { label: "Kerajinan", code: "KRJ", icon: RiPaletteLine },
  jasa: { label: "Jasa", code: "JSA", icon: RiToolsLine },
  pertanian: { label: "Pertanian", code: "AGR", icon: RiSeedlingLine },
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

/* ------------------------------------------------------------------ */
/* Komponen Kartu UMKM                                                */
/* ------------------------------------------------------------------ */

function UmkmCard({
  umkm,
  index,
  onDetail,
}: {
  umkm: Umkm;
  index: number;
  onDetail: (umkm: Umkm) => void;
}) {
  const meta = CATEGORY_META[umkm.category] || CATEGORY_META["jasa"];
  const Icon = meta.icon;

  return (
    <article className="group bg-white border border-black rounded-2xl hard-shadow-static overflow-hidden flex flex-col h-full">
      {/* Header kartu */}
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="font-mono text-[10px] tracking-widest uppercase text-slate-500 border border-black/30 bg-slate-50 px-2 py-0.5 rounded">
          {meta.code} · {String(index + 1).padStart(3, "0")}
        </span>
        <span className="flex items-center gap-1 text-xs font-mono bg-orange-300/25 text-[#1c1b17] font-semibold px-2 py-1 rounded border border-black/20">
          <RiStarFill className="h-3 w-3 text-orange-300" />
          {(umkm.rating || 5.0).toFixed(1)}
        </span>
      </div>

      {/* Isi kartu */}
      <div className="px-5 pt-3 pb-5 flex-1">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 shrink-0 rounded-lg bg-indigo-50 border border-black/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-indigo-500" />
          </span>
          <h3 className="font-bold text-base leading-snug">{umkm.name}</h3>
        </div>
        <p className="flex items-center gap-1 text-xs text-slate-500 mt-2">
          <RiMapPin2Line className="h-3.5 w-3.5 shrink-0" />
          {meta.label} · {umkm.area || umkm.city}
        </p>
        <p className="text-sm text-slate-600 leading-relaxed mt-3 line-clamp-2">
          {umkm.description}
        </p>

        <div className="mt-4 pt-3 border-t border-dashed border-black/30 flex flex-col font-mono text-xs gap-1">
          <span className="flex items-center gap-1.5 text-slate-600">
            <RiShoppingBagLine className="h-3.5 w-3.5" />
            {umkm.products?.length || 0} produk
          </span>
          <span className="flex items-center gap-1.5 text-indigo-500 font-semibold">
            <RiBriefcaseLine className="h-3.5 w-3.5" />
            {umkm.jobs?.length || 0} lowongan kerja
          </span>
          {/* 👈 Tampilan jam buka dinamis di Kartu */}
          <span className="flex items-center gap-1.5 text-slate-600">
            <RiTimeLine className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            {umkm.openHours || "Belum diatur"}
          </span>
        </div>
      </div>

      {/* Aksi kartu */}
      <div className="px-5 pb-5 flex gap-2">
        <OriginButton
          onClick={() => onDetail(umkm)}
          className="flex-1 bg-blue-400 font-medium text-sm h-11 px-4 cursor-pointer hard-shadow"
        >
          Lihat Detail
        </OriginButton>
        <a
          href={`https://wa.me/${umkm.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat ${umkm.name} via WhatsApp`}
          className="h-11 w-11 shrink-0 rounded-xl border border-black bg-white hard-shadow flex items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors"
        >
          <RiWhatsappLine className="h-5 w-5 text-emerald-600" />
        </a>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Halaman Utama Cek UMKM                                             */
/* ------------------------------------------------------------------ */

export default function CekUmkmPage() {
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryKey | "semua">("semua");
  const [city, setCity] = useState("semua");
  const [selected, setSelected] = useState<Umkm | null>(null);

  useEffect(() => {
    async function fetchUmkmData() {
      try {
        // Direktori publik: semua UMKM yang sudah dipublikasikan (isPublished).
        const res = await fetch("/api/umkm");
        if (!res.ok) {
          throw new Error("Gagal mengambil data UMKM");
        }
        const data = await res.json();
        setUmkmList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal mengambil data UMKM dari DB", err);
        setUmkmList([]);
      }
    }

    fetchUmkmData();
  }, []);

  const cityOptions = useMemo(
    () => [
      { value: "semua", label: "Semua Kota" },
      ...Array.from(new Set(umkmList.map((u) => u.city)))
        .filter(Boolean)
        .sort()
        .map((c) => ({ value: c, label: c })),
    ],
    [umkmList]
  );

  const stats = useMemo(
    () => ({
      total: umkmList.length,
      categories: Object.keys(CATEGORY_META).length,
      products: umkmList.reduce((sum, u) => sum + (u.products?.length || 0), 0),
      jobs: umkmList.reduce((sum, u) => sum + (u.jobs?.length || 0), 0),
    }),
    [umkmList]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return umkmList.filter((u) => {
      const matchCategory =
        category === "semua" || u.category === category;
      const matchCity = city === "semua" || u.city === city;
      const metaLabel = CATEGORY_META[u.category]?.label || "";
      const matchQuery =
        !q ||
        [u.name, u.area, u.city, u.description, metaLabel]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchCategory && matchCity && matchQuery;
    });
  }, [query, category, city, umkmList]);

  const hasActiveFilter =
    query.trim() !== "" || category !== "semua" || city !== "semua";

  const resetFilters = () => {
    setQuery("");
    setCategory("semua");
    setCity("semua");
  };

  const chipClass = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
      active
        ? "bg-slate-900 border-slate-900 text-white"
        : "bg-white border-black/40 text-slate-600 hover:border-black hover:text-slate-900"
    }`;

  return (
    <div className="relative top-0 z-0 bg-white text-slate-900 flex flex-col font-sans">
      {/* 1. HERO + PENCARIAN */}
      <PleaseReveal>
        <section className="mx-auto px-6 pt-14 pb-12 w-full border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-indigo-500">
              Direktori UMKM
            </span>
            <h1 className="font-display font-bold text-3xl md:text-4xl mt-2">
              Cek <span className="text-[#0D47A1]">UMKM</span> di Sekitarmu
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mt-3">
              Jelajahi usaha lokal terdaftar, lihat katalog produknya, dan
              hubungi langsung pemiliknya.
            </p>

            {/* Pencarian */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mt-8"
            >
              <div className="relative flex-1">
                <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari nama, kategori, atau lokasi…"
                  aria-label="Cari UMKM"
                  className="w-full h-12 rounded-xl border border-black bg-white pl-11 pr-4 text-sm hard-shadow-static focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                />
              </div>
              <PleaseSelect
                options={cityOptions}
                value={city}
                onChange={setCity}
                className="sm:w-48"
              />
            </form>

            {/* Filter kategori */}
            <div className="flex flex-wrap justify-center gap-2 pt-6">
              <button
                type="button"
                onClick={() => setCategory("semua")}
                className={chipClass(category === "semua")}
              >
                Semua
              </button>
              {(Object.keys(CATEGORY_META) as CategoryKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={chipClass(category === key)}
                >
                  {CATEGORY_META[key].label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </PleaseReveal>

      {/* 2. STATISTIK + DAFTAR UMKM */}
      <section className="bg-slate-50 border-t border-slate-200 w-full">
        <div className="max-w-6xl mx-auto px-6 w-full">
          {/* Statistik */}
          <div>
            <div className="pt-10">
              <div className="grid grid-cols-2 md:grid-cols-4 bg-white border border-black rounded-2xl hard-shadow-static overflow-hidden">
                {[
                  { label: "UMKM Terdaftar", value: stats.total },
                  { label: "Kategori", value: stats.categories },
                  { label: "Produk", value: stats.products },
                  { label: "Lowongan Aktif", value: stats.jobs },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="border-b border-black/10 md:border-b-0 md:border-l first:border-l-0 last:border-b-0 p-4 text-center"
                  >
                    <div className="font-mono text-2xl font-bold">
                      {s.value}
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info hasil + reset */}
          <div>
            <div className="flex items-center justify-between pt-10 pb-6">
              <p className="font-mono text-xs tracking-widest uppercase text-slate-500">
                Menampilkan {filtered.length} dari {umkmList.length} UMKM
              </p>
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  <RiRefreshLine className="h-3.5 w-3.5" />
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Grid UMKM / Empty state */}
          <div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
                {filtered.map((umkm, i) => (
                  <UmkmCard
                    key={umkm.id}
                    umkm={umkm}
                    index={i}
                    onDetail={setSelected}
                  />
                ))}
              </div>
            ) : (
              <div className="max-w-md mx-auto text-center py-16 px-6 mb-16 bg-white border border-black rounded-2xl hard-shadow-static">
                <RiUserLocationLine className="h-10 w-10 text-indigo-500 mx-auto" />
                <h3 className="font-bold mt-4">Belum Ada Data UMKM Terdeploy</h3>
                <p className="text-sm text-slate-600 mt-2">
                  {hasActiveFilter
                    ? "Tidak ada UMKM yang cocok dengan filter kamu."
                    : "Silakan isi dan simpan form Profil UMKM kamu terlebih dahulu."}
                </p>
                {hasActiveFilter ? (
                  <OriginButton
                    onClick={resetFilters}
                    className="mt-6 bg-amber-300 font-medium text-sm h-11 px-4 cursor-pointer hard-shadow"
                  >
                    Reset Filter
                  </OriginButton>
                ) : (
                  <a href="/dashboard" className="inline-block mt-6">
                    <OriginButton className="bg-amber-300 font-medium text-sm h-11 px-4 cursor-pointer hard-shadow flex items-center gap-2">
                      <RiAddCircleLine className="h-4 w-4" />
                      Isi Profil UMKM Sekarang
                    </OriginButton>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. CTA BANNER */}
      <section className="px-6 py-14 w-full border-t border-slate-200 bg-sky-600">
        <PleaseReveal>
          <div className="max-w-6xl mx-auto text-white rounded-2xl p-8 text-center space-y-4 content-center">
            <h2 className="text-4xl font-bold text-amber-300">
              Punya UMKM?
              <br />
              Daftarkan sekarang, Gratis
            </h2>
            <p className="text-md max-w-md mx-auto">
              Tampilkan usahamu di direktori ini dan kelola pencatatan
              penjualan dengan lebih gampang.
            </p>
            <div className="pt-2">
              <OriginButton
                className="bg-amber-300 text-black font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hard-shadow"
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
              >
                Mulai Kelola Toko
              </OriginButton>
            </div>
          </div>
        </PleaseReveal>
      </section>

      {/* 4. MODAL DETAIL UMKM */}
      <PleasePop
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
      >
        {selected && (
          <div className="space-y-5">
            {/* Info dasar */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] tracking-widest uppercase text-slate-500 border border-black/30 bg-slate-50 px-2 py-0.5 rounded">
                {CATEGORY_META[selected.category]?.label || selected.category}
              </span>
              <span className="flex items-center gap-1 text-xs font-mono bg-orange-300/25 text-[#1c1b17] font-semibold px-2 py-1 rounded border border-black/20">
                <RiStarFill className="h-3 w-3 text-orange-300" />
                {(selected.rating || 5.0).toFixed(1)}
              </span>
            </div>

            <div className="space-y-1.5 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <RiMapPin2Line className="h-4 w-4 shrink-0 text-slate-400" />
                {selected.area || selected.city}
              </p>
              <p className="flex items-center gap-2">
                <RiTimeLine className="h-4 w-4 shrink-0 text-slate-400" />
                {selected.openHours ? `Buka ${selected.openHours}` : "Jam operasional belum diisi"}
              </p>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed border-t border-dashed border-black/30 pt-4">
              {selected.description}
            </p>

            {/* Katalog produk */}
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-indigo-500 mb-3">
                Katalog Produk
              </h4>
              {selected.products && selected.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {selected.products.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-black/20 bg-slate-50 hover:bg-white hover:border-black transition-all"
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-indigo-100 border border-black/10 flex items-center justify-center">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <RiShoppingBagLine className="h-5 w-5 text-indigo-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5
                          className="truncate text-xs font-bold text-slate-900"
                          title={p.name}
                        >
                          {p.name}
                        </h5>
                        <p className="font-mono text-[11px] font-bold text-emerald-600 mt-0.5">
                          {formatPrice(p.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">Belum ada produk.</p>
              )}
            </div>

            {/* Lowongan kerja */}
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-indigo-500 mb-3">
                Lowongan Kerja
              </h4>
              {selected.jobs && selected.jobs.length > 0 ? (
                <ul className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {selected.jobs.map((j, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between gap-3 border border-black/20 rounded-xl px-4 py-2.5 text-sm bg-white"
                    >
                      <span className="flex items-center gap-2 text-slate-700 truncate">
                        <RiBriefcaseLine className="h-4 w-4 shrink-0 text-indigo-500" />
                        <span className="truncate font-medium">{j.title}</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest border border-black/20 bg-slate-50 px-1.5 py-0.5 rounded shrink-0">
                          {j.type}
                        </span>
                      </span>
                      <span className="font-mono text-xs font-semibold text-indigo-600 shrink-0">
                        {j.salary}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  Belum ada lowongan aktif.
                </p>
              )}
            </div>

            {/* Kontak */}
            <a
              href={`https://wa.me/${selected.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block pt-1"
            >
              <OriginButton className="w-full bg-emerald-500 text-white font-medium text-sm h-11 px-4 cursor-pointer hard-shadow flex items-center justify-center gap-2">
                <RiWhatsappLine className="h-4 w-4" />
                Chat via WhatsApp
              </OriginButton>
            </a>
          </div>
        )}
      </PleasePop>
    </div>
  );
}