"use client";

// Form produk yang dipakai bersama: tambah (CreateNewDialog) dan edit
// (halaman Produk). Gambar diupload → dikompresi di klien → dikirim sebagai
// data URL agar kolom gambarUrl di DB tetap kecil. Fetch ke API dilakukan
// oleh pemanggil lewat onSubmit.

import { useEffect, useRef, useState } from "react";
import { RiArrowLeftLine, RiImageAddLine } from "@remixicon/react";
import {
  MAX_ORIGINAL_FILE_BYTES,
  optimizeImage,
} from "@/lib/optimize-image";

export interface NewProductInput {
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
  /** Data URL hasil kompresi, URL lama, atau null bila tanpa gambar. */
  gambarUrl?: string | null;
}

export const PRODUCT_CATEGORIES = [
  "Makanan",
  "Minuman",
  "Alat",
  "Perawatan",
  "Perabotan",
  "Lainnya",
] as const;

// Kategori lama di DB bisa apa saja; pilih hanya yang ada di daftar.
export function toValidCategory(category: string | undefined): string {
  return category &&
    (PRODUCT_CATEGORIES as readonly string[]).includes(category)
    ? category
    : PRODUCT_CATEGORIES[0];
}

export interface ProductFormValues {
  name: string;
  price: string;
  category: string;
  stock: string;
  description: string;
}

export interface ProductFormProps {
  /** Nilai awal untuk mode edit; kosong untuk produk baru. */
  initial?: Partial<ProductFormValues> & { gambarUrl?: string | null };
  submitLabel?: string;
  /** Tampilkan tombol "Kembali" (dipakai dialog Buat Baru). */
  showBack?: boolean;
  onBack?: () => void;
  onCancel: () => void;
  /** Terima payload siap simpan; pemanggil bertugas fetch + tutup dialog. */
  onSubmit: (input: NewProductInput) => Promise<void> | void;
}

type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

const productInputClass = (invalid?: string) =>
  `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    invalid ? "border-rose-400" : "border-gray-300"
  }`;

export default function ProductForm({
  initial,
  submitLabel = "Simpan Produk",
  showBack = false,
  onBack,
  onCancel,
  onSubmit,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name ?? "",
    price: initial?.price ?? "",
    category: toValidCategory(initial?.category),
    stock: initial?.stock ?? "",
    description: initial?.description ?? "",
  });
  const [image, setImage] = useState<string | null>(
    initial?.gambarUrl ?? null,
  );
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => firstFieldRef.current?.focus());
  }, []);

  const setField = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = (): boolean => {
    const next: ProductFormErrors = {};
    if (!values.name.trim()) {
      next.name = "Nama produk wajib diisi.";
    }
    const price = Number(values.price);
    if (!values.price.trim() || Number.isNaN(price) || price <= 0) {
      next.price = "Harga harus lebih dari 0.";
    }
    const stock = Number(values.stock);
    if (!values.stock.trim() || Number.isNaN(stock) || stock < 0) {
      next.stock = "Stok tidak boleh negatif.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // izinkan memilih file yang sama lagi
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File yang dipilih harus berupa gambar.");
      return;
    }
    if (file.size > MAX_ORIGINAL_FILE_BYTES) {
      alert("Ukuran gambar maksimal 5 MB.");
      return;
    }

    setProcessingImage(true);
    try {
      const dataUrl = await optimizeImage(file);
      setImage(dataUrl);
    } catch (err) {
      console.error("Gagal memproses gambar:", err);
      alert("Gagal memproses gambar. Coba file lain.");
    } finally {
      setProcessingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const payload: NewProductInput = {
      name: values.name.trim(),
      price: Math.round(Number(values.price)),
      category: values.category,
      stock: Math.round(Number(values.stock)),
      description: values.description.trim() || undefined,
      gambarUrl: image,
    };

    setLoading(true);
    try {
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="product-name"
            className="mb-1.5 block text-sm font-medium text-gray-800"
          >
            Nama Produk <span className="text-rose-500">*</span>
          </label>
          <input
            id="product-name"
            ref={firstFieldRef}
            type="text"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="contoh: Air Mineral"
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "product-name-error" : undefined}
            className={productInputClass(errors.name)}
          />
          {errors.name && (
            <p id="product-name-error" className="mt-1 text-xs text-rose-600">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="product-price"
              className="mb-1.5 block text-sm font-medium text-gray-800"
            >
              Harga (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              id="product-price"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              value={values.price}
              onChange={(e) => setField("price", e.target.value)}
              placeholder="0"
              aria-required="true"
              aria-invalid={Boolean(errors.price)}
              aria-describedby={errors.price ? "product-price-error" : undefined}
              className={productInputClass(errors.price)}
            />
            {errors.price && (
              <p
                id="product-price-error"
                className="mt-1 text-xs text-rose-600"
              >
                {errors.price}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="product-stock"
              className="mb-1.5 block text-sm font-medium text-gray-800"
            >
              Stok <span className="text-rose-500">*</span>
            </label>
            <input
              id="product-stock"
              type="number"
              min={0}
              step="1"
              inputMode="numeric"
              value={values.stock}
              onChange={(e) => setField("stock", e.target.value)}
              placeholder="0"
              aria-required="true"
              aria-invalid={Boolean(errors.stock)}
              aria-describedby={errors.stock ? "product-stock-error" : undefined}
              className={productInputClass(errors.stock)}
            />
            {errors.stock && (
              <p
                id="product-stock-error"
                className="mt-1 text-xs text-rose-600"
              >
                {errors.stock}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="product-category"
            className="mb-1.5 block text-sm font-medium text-gray-800"
          >
            Kategori <span className="text-rose-500">*</span>
          </label>
          <select
            id="product-category"
            value={values.category}
            onChange={(e) => setField("category", e.target.value)}
            className={`${productInputClass()} cursor-pointer`}
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="product-image"
            className="mb-1.5 block text-sm font-medium text-gray-800"
          >
            Foto Produk <span className="text-gray-400">(opsional)</span>
          </label>
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={processingImage}
              className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-blue-400 hover:text-blue-500 disabled:opacity-50"
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt="Pratinjau produk"
                  className="h-full w-full object-cover"
                />
              ) : processingImage ? (
                <span className="text-xs">Memproses…</span>
              ) : (
                <RiImageAddLine size={26} />
              )}
            </button>
            <div className="space-y-1 pt-0.5 text-xs text-gray-500">
              <p>Klik kotak untuk memilih gambar (maks. 5 MB).</p>
              <p>Gambar otomatis dikecilkan agar hemat ruang.</p>
              {image && (
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="cursor-pointer font-medium text-rose-600 hover:text-rose-700"
                >
                  Hapus gambar
                </button>
              )}
            </div>
          </div>
          <input
            id="product-image"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div>
          <label
            htmlFor="product-description"
            className="mb-1.5 block text-sm font-medium text-gray-800"
          >
            Deskripsi <span className="text-gray-400">(opsional)</span>
          </label>
          <textarea
            id="product-description"
            rows={3}
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Deskripsi singkat produk"
            className={`${productInputClass()} resize-none`}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <RiArrowLeftLine size={16} />
            Kembali
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading || processingImage}
            className="cursor-pointer rounded-xl border border-black bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 hard-shadow disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
