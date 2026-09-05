"use client";
import { useState, useEffect, ComponentType } from "react";
import Link from "next/link";
import {
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiCloseLine,
  RiEditLine,
  RiFacebookCircleLine,
  RiFileTextLine,
  RiGlobalLine,
  RiInstagramLine,
  RiMapPin2Line,
  RiWhatsappLine,
  RiSaveLine,
  RiStore2Line,
  RiTimeLine,
} from "@remixicon/react";

const UMKM_CATEGORIES = [
  { value: "warung", label: "Warung" },
  { value: "kedai", label: "Kedai & Kafe" },
  { value: "kuliner", label: "Kuliner" },
  { value: "toko", label: "Toko Kelontong" },
  { value: "fashion", label: "Fashion" },
  { value: "kerajinan", label: "Kerajinan" },
  { value: "jasa", label: "Jasa" },
  { value: "pertanian", label: "Pertanian" },
];

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [name, setName] = useState<string>("Nama Usaha");
  const [category, setCategory] = useState<string>("");
  const [openHours, setOpenHours] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [jobsText, setJobsText] = useState<string>("");
  const [isOpeningJob, setIsOpeningJob] = useState<boolean>(false);
  const [insta, setInsta] = useState<string>("");
  const [fb, setFb] = useState<string>("");
  const [web, setWeb] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [draftName, setDraftName] = useState<string>("");
  const [draftCategory, setDraftCategory] = useState<string>("");
  const [draftOpenHours, setDraftOpenHours] = useState<string>("");
  const [draftStreet, setDraftStreet] = useState<string>("");
  const [draftDistrict, setDraftDistrict] = useState<string>("");
  const [draftCity, setDraftCity] = useState<string>("");
  const [draftProvince, setDraftProvince] = useState<string>("");
  const [draftPostalCode, setDraftPostalCode] = useState<string>("");
  const [draftWhatsapp, setDraftWhatsapp] = useState<string>("");
  const [draftJobsText, setDraftJobsText] = useState<string>("");
  const [draftIsOpeningJob, setDraftIsOpeningJob] = useState<boolean>(false);
  const [draftInsta, setDraftInsta] = useState<string>("");
  const [draftFb, setDraftFb] = useState<string>("");
  const [draftWeb, setDraftWeb] = useState<string>("");
  const [draftDescription, setDraftDescription] = useState<string>("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profileUmkm");
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "Nama Usaha");
          setCategory(data.category || "");
          setOpenHours(data.openHours || "");
          setStreet(data.street || "");
          setDistrict(data.district || "");
          setCity(data.city || "");
          setProvince(data.province || "");
          setPostalCode(data.postalCode || "");
          setWhatsapp(data.whatsapp || "");

          const jobVal = data.jobsText || data.jobs || "";
          setJobsText(jobVal);
          setIsOpeningJob(Boolean(jobVal.trim()));

          setInsta(data.linkInsta || "");
          setFb(data.linkFb || "");
          setWeb(data.linkWeb || "");
          setDescription(data.description || "");
        }
      } catch (err) {
        console.error("Gagal load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const startEdit = (): void => {
    setDraftName(name);
    setDraftCategory(category);
    setDraftOpenHours(openHours);
    setDraftStreet(street);
    setDraftDistrict(district);
    setDraftCity(city);
    setDraftProvince(province);
    setDraftPostalCode(postalCode);
    setDraftWhatsapp(whatsapp);
    setDraftJobsText(jobsText);
    setDraftIsOpeningJob(isOpeningJob);
    setDraftInsta(insta);
    setDraftFb(fb);
    setDraftWeb(web);
    setDraftDescription(description);
    setIsEditing(true);
  };

  const cancelEdit = (): void => setIsEditing(false);

  const saveEdit = async (): Promise<void> => {
    if (!draftName.trim()) {
      alert("Nama usaha tidak boleh kosong!");
      return;
    }

    setIsSaving(true);

    const finalJobsText = draftIsOpeningJob ? draftJobsText.trim() : "";

    const payload = {
      name: draftName.trim(),
      category: draftCategory,
      openHours: draftOpenHours.trim(),
      street: draftStreet.trim(),
      district: draftDistrict.trim(),
      city: draftCity.trim(),
      province: draftProvince.trim(),
      postalCode: draftPostalCode.trim(),
      whatsapp: draftWhatsapp.trim(),
      jobsText: finalJobsText,
      linkInsta: draftInsta.trim(),
      linkFb: draftFb.trim(),
      linkWeb: draftWeb.trim(),
      description: draftDescription.trim(),
    };

    try {
      const res = await fetch("/api/profileUmkm", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setName(payload.name);
        setCategory(payload.category);
        setOpenHours(payload.openHours);
        setStreet(payload.street);
        setDistrict(payload.district);
        setCity(payload.city);
        setProvince(payload.province);
        setPostalCode(payload.postalCode);
        setWhatsapp(payload.whatsapp);
        setJobsText(payload.jobsText);
        setIsOpeningJob(Boolean(payload.jobsText));
        setInsta(payload.linkInsta);
        setFb(payload.linkFb);
        setWeb(payload.linkWeb);
        setDescription(payload.description);
        setIsEditing(false);

        window.dispatchEvent(
          new CustomEvent("profile-updated", {
            detail: { name: payload.name },
          }),
        );
      } else {
        alert("Gagal menyimpan profil ke server.");
      }
    } catch (err) {
      console.error("Gagal menyimpan profil:", err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <p className="p-8 text-sm text-gray-500">Memuat profil...</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
        <Link
          href="/more"
          aria-label="Kembali ke menu"
          className="inline-flex mb-4 gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 md:hidden"
        >
          <RiArrowLeftLine size={17} />
          Kembali
        </Link>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-400">
              Sistem
            </p>
            <h1 className="mt-1 text-xl font-bold text-gray-900 md:text-2xl">
              PROFIL UMKM
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola informasi usaha yang akan ditampilkan di profilmu.
            </p>
          </div>
        </div>

        <div className="w-full overflow-hidden group hard-shadow-static border-black rounded-2xl border bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-blue-50 px-5 py-5 sm:px-7">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-white text-blue-600">
                <RiStore2Line size={28} />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-blue-600">
                  Informasi usaha
                </p>
                <h2 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
                  {name}
                </h2>
                {category && (
                  <p className="mt-0.5 text-xs font-medium text-blue-500">
                    {UMKM_CATEGORIES.find((c) => c.value === category)?.label ??
                      category}
                  </p>
                )}
              </div>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={startEdit}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <RiEditLine size={16} />
                Edit
              </button>
            )}
          </div>

          <div className="p-5 sm:p-7">
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <RiEditLine size={18} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    Edit profil usaha
                  </h3>
                </div>

                <label className="block text-sm font-medium text-slate-600">
                  Nama usaha
                  <input
                    required
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-600">
                  Kategori Usaha
                  <select
                    value={draftCategory}
                    onChange={(event) => setDraftCategory(event.target.value)}
                    className="mt-1 w-full cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  >
                    <option value="">Pilih kategori...</option>
                    {UMKM_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>

                {/* 👈 Input Jam Operasional / Jam Buka */}
                <label className="block text-sm font-medium text-slate-600">
                  Jam Operasional / Waktu Buka
                  <input
                    type="text"
                    value={draftOpenHours}
                    onChange={(event) => setDraftOpenHours(event.target.value)}
                    placeholder="Contoh: 08.00 - 17.00 / 24 Jam"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-600">
                  Nomor WhatsApp / Telepon
                  <input
                    type="tel"
                    value={draftWhatsapp}
                    onChange={(event) => setDraftWhatsapp(event.target.value)}
                    placeholder="Contoh: 6281234567890"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </label>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-slate-600">
                    Alamat
                  </legend>
                  <label className="block text-sm text-slate-600">
                    Jalan
                    <input
                      value={draftStreet}
                      onChange={(event) => setDraftStreet(event.target.value)}
                      placeholder="Contoh: Jl. Malioboro No. 10"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-sm text-slate-600">
                      Kecamatan
                      <input
                        value={draftDistrict}
                        onChange={(event) =>
                          setDraftDistrict(event.target.value)
                        }
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="block text-sm text-slate-600">
                      Kabupaten/Kota
                      <input
                        value={draftCity}
                        onChange={(event) => setDraftCity(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="block text-sm text-slate-600">
                      Provinsi
                      <input
                        value={draftProvince}
                        onChange={(event) =>
                          setDraftProvince(event.target.value)
                        }
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="block text-sm text-slate-600">
                      Kode pos
                      <input
                        inputMode="numeric"
                        value={draftPostalCode}
                        onChange={(event) =>
                          setDraftPostalCode(event.target.value)
                        }
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                      />
                    </label>
                  </div>
                </fieldset>

                <div className="space-y-3 pt-2">
                  <label className="block text-sm font-medium text-slate-600">
                    Status Lowongan Kerja
                  </label>

                  <div className="flex items-center gap-6 p-1">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <input
                        type="radio"
                        name="jobStatus"
                        checked={!draftIsOpeningJob}
                        onChange={() => {
                          setDraftIsOpeningJob(false);
                          setDraftJobsText("");
                        }}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span
                        className={
                          !draftIsOpeningJob
                            ? "text-slate-900 font-semibold"
                            : "text-slate-500"
                        }
                      >
                        Tidak Membuka Lowongan
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <input
                        type="radio"
                        name="jobStatus"
                        checked={draftIsOpeningJob}
                        onChange={() => setDraftIsOpeningJob(true)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span
                        className={
                          draftIsOpeningJob
                            ? "text-blue-600 font-semibold"
                            : "text-slate-500"
                        }
                      >
                        Sedang Membuka Lowongan
                      </span>
                    </label>
                  </div>

                  {draftIsOpeningJob && (
                    <div className="pt-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Posisi Pekerjaan (Pisahkan dengan koma jika lebih dari
                        satu)
                      </label>
                      <textarea
                        rows={2}
                        value={draftJobsText}
                        onChange={(event) =>
                          setDraftJobsText(event.target.value)
                        }
                        placeholder="Contoh: Barista (Full-time), Staf Gudang, Kasir"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>

                <label className="block text-sm text-slate-600">
                  Instagram
                  <input
                    type="url"
                    value={draftInsta}
                    onChange={(event) => setDraftInsta(event.target.value)}
                    placeholder="https://instagram.com/namausaha"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </label>
                <label className="block text-sm text-slate-600">
                  Facebook
                  <input
                    type="url"
                    value={draftFb}
                    onChange={(event) => setDraftFb(event.target.value)}
                    placeholder="https://facebook.com/namausaha"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </label>
                <label className="block text-sm text-slate-600">
                  Website
                  <input
                    type="url"
                    value={draftWeb}
                    onChange={(event) => setDraftWeb(event.target.value)}
                    placeholder="https://namausaha.com"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </label>
                <label className="block text-sm text-slate-600">
                  Deskripsi
                  <textarea
                    rows={4}
                    value={draftDescription}
                    onChange={(event) =>
                      setDraftDescription(event.target.value)
                    }
                    placeholder="Ceritakan usaha dan produk yang kamu jual"
                    className="mt-1 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    <RiCloseLine size={16} />
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={saveEdit}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    <RiSaveLine size={16} />
                    {isSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-7">
                <div className="grid gap-6 md:grid-cols-3">
                  {" "}
                  {/* Changed to 3 cols for alignment */}
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <RiMapPin2Line size={15} />
                      Alamat usaha
                    </div>
                    <p className="text-sm leading-6 text-gray-800">
                      {[street, district, city, province, postalCode]
                        .filter(Boolean)
                        .join(", ") || "Belum diisi"}
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <RiTimeLine size={15} />
                      Jam Operasional
                    </div>
                    <p className="text-sm leading-6 text-gray-800">
                      {openHours || "Belum diisi"}
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <RiWhatsappLine size={15} />
                      Kontak / WhatsApp
                    </div>
                    <p className="text-sm leading-6 text-gray-800">
                      {whatsapp || "Belum diisi"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <RiBriefcaseLine size={15} />
                      Lowongan Kerja
                    </div>
                    <p className="whitespace-pre-line text-sm leading-6 text-gray-800">
                      {jobsText || "Belum ada lowongan"}
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <RiFileTextLine size={15} />
                      Deskripsi usaha
                    </div>
                    <p className="whitespace-pre-line text-sm leading-6 text-gray-800">
                      {description || "Belum diisi"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Link usaha
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <SocialLink
                      href={insta}
                      label="Instagram"
                      icon={RiInstagramLine}
                    />
                    <SocialLink
                      href={fb}
                      label="Facebook"
                      icon={RiFacebookCircleLine}
                    />
                    <SocialLink
                      href={web}
                      label="Website"
                      icon={RiGlobalLine}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number | string; className?: string }>;
}) {
  if (!href) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-200 px-3 py-3 text-sm text-gray-400">
        <Icon size={21} />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    >
      <Icon size={21} />
      <span className="truncate">{label}</span>
    </a>
  );
}
