"use client";
import { useState } from "react";
import {
  RiCloseLine,
  RiEditLine,
  RiFacebookCircleLine,
  RiFileTextLine,
  RiGlobalLine,
  RiInstagramLine,
  RiMapPin2Line,
  RiSaveLine,
  RiStore2Line,
} from "@remixicon/react";

interface EditableProfileSectionProps {
  initialName?: string;
  initialAddress?: string;
  initialStreet?: string;
  initialDistrict?: string;
  initialCity?: string;
  initialProvince?: string;
  initialPostalCode?: string;
  linkInsta?: string;
  linkFb?: string;
  linkWeb?: string;
  initialDescription?: string;
  onSave?: (data: {
    name: string;
    address: string;
    street: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
    linkInsta: string;
    linkFb: string;
    linkWeb: string;
    description: string;
  }) => void;
}

export default function EditProfile({
  initialName = "Nama Usaha",
  initialAddress = "",
  initialStreet = "",
  initialDistrict = "",
  initialCity,
  initialProvince = "",
  initialPostalCode = "",
  linkInsta = "",
  linkFb = "",
  linkWeb = "",
  initialDescription = "",
  onSave,
}: EditableProfileSectionProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(initialName);
  const [street, setStreet] = useState<string>(initialStreet);
  const [district, setDistrict] = useState<string>(initialDistrict);
  const [city, setCity] = useState<string>(initialCity ?? initialAddress);
  const [province, setProvince] = useState<string>(initialProvince);
  const [postalCode, setPostalCode] = useState<string>(initialPostalCode);
  const [insta, setInsta] = useState<string>(linkInsta);
  const [fb, setFb] = useState<string>(linkFb);
  const [web, setWeb] = useState<string>(linkWeb);
  const [description, setDescription] = useState<string>(initialDescription);

  const [draftName, setDraftName] = useState<string>(initialName);
  const [draftStreet, setDraftStreet] = useState<string>(initialStreet);
  const [draftDistrict, setDraftDistrict] = useState<string>(initialDistrict);
  const [draftCity, setDraftCity] = useState<string>(
    initialCity ?? initialAddress,
  );
  const [draftProvince, setDraftProvince] = useState<string>(initialProvince);
  const [draftPostalCode, setDraftPostalCode] =
    useState<string>(initialPostalCode);
  const [draftInsta, setDraftInsta] = useState<string>(linkInsta);
  const [draftFb, setDraftFb] = useState<string>(linkFb);
  const [draftWeb, setDraftWeb] = useState<string>(linkWeb);
  const [draftDescription, setDraftDescription] =
    useState<string>(initialDescription);

  const startEdit = (): void => {
    setDraftName(name);
    setDraftStreet(street);
    setDraftDistrict(district);
    setDraftCity(city);
    setDraftProvince(province);
    setDraftPostalCode(postalCode);
    setDraftInsta(insta);
    setDraftFb(fb);
    setDraftWeb(web);
    setDraftDescription(description);
    setIsEditing(true);
  };

  const cancelEdit = (): void => {
    setIsEditing(false);
  };

  const saveEdit = (): void => {
    if (!draftName.trim()) return; // nama wajib diisi
    const newName = draftName.trim();
    const newStreet = draftStreet.trim();
    const newDistrict = draftDistrict.trim();
    const newCity = draftCity.trim();
    const newProvince = draftProvince.trim();
    const newPostalCode = draftPostalCode.trim();
    const newAddress = [
      newStreet,
      newDistrict,
      newCity,
      newProvince,
      newPostalCode,
    ]
      .filter(Boolean)
      .join(", ");
    const newInsta = draftInsta.trim();
    const newFb = draftFb.trim();
    const newWeb = draftWeb.trim();
    const newDescription = draftDescription.trim();
    setName(newName);
    setStreet(newStreet);
    setDistrict(newDistrict);
    setCity(newCity);
    setProvince(newProvince);
    setPostalCode(newPostalCode);
    setInsta(newInsta);
    setFb(newFb);
    setWeb(newWeb);
    setDescription(newDescription);
    setIsEditing(false);
    onSave?.({
      name: newName,
      address: newAddress,
      street: newStreet,
      district: newDistrict,
      city: newCity,
      province: newProvince,
      postalCode: newPostalCode,
      linkInsta: newInsta,
      linkFb: newFb,
      linkWeb: newWeb,
      description: newDescription,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
        <div className="mb-6">
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
                    className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    <RiCloseLine size={16} />
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <RiSaveLine size={16} />
                    Simpan
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-7">
                <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
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
  icon: typeof RiInstagramLine;
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
