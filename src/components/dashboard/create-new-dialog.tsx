"use client";

// Dialog "Buat Baru" — tombol serbaguna untuk menambah produk atau transaksi.
// Memakai PleasePop dan memakai ulang TransactionForm (sama dengan
// AddTransactionDialog) agar alur pendapatan/pengeluaran konsisten.

import { useEffect, useRef, useState } from "react";
import {
  RiArrowDownCircleLine,
  RiArrowLeftLine,
  RiArrowUpCircleLine,
  RiBox3Line,
} from "@remixicon/react";
import PleasePop from "@/components/ui/please-pop";
import TransactionForm from "@/components/dashboard/transaction-form";
import {
  type NewFinanceTransaction,
  type TransactionType,
} from "@/lib/finance";

export interface NewProductInput {
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
}

type Step = "choose" | "product" | "transaction";

const PRODUCT_CATEGORIES = [
  "Makanan",
  "Minuman",
  "Alat",
  "Perawatan",
  "Perabotan",
  "Lainnya",
] as const;

export default function CreateNewDialog({
  open,
  onClose,
  onSaveTransaction,
  onSaveProduct,
}: {
  open: boolean;
  onClose: () => void;
  onSaveTransaction: (input: NewFinanceTransaction) => void;
  onSaveProduct: (input: NewProductInput) => void;
}) {
  const [step, setStep] = useState<Step>("choose");
  const [type, setType] = useState<TransactionType>("income");

  const openTransaction = (nextType: TransactionType) => {
    setType(nextType);
    setStep("transaction");
  };

  const backToChoose = () => setStep("choose");

  const dialogTitle =
    step === "choose"
      ? "Buat Baru"
      : step === "product"
        ? "Tambah Produk"
        : type === "income"
          ? "Tambah Pendapatan"
          : "Tambah Pengeluaran";

  return (
    <PleasePop isOpen={open} onClose={onClose} title={dialogTitle}>
      {step === "choose" ? (
        <div>
          <p className="text-sm text-gray-500">
            Pilih apa yang ingin Anda buat.
          </p>

          <button
            type="button"
            onClick={() => setStep("product")}
            className="group mt-4 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-black/20 bg-white p-4 text-left transition-colors hover:border-black hover:bg-blue-50/40"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <RiBox3Line size={22} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-gray-900">
                Tambah Produk
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-gray-500">
                Tambahkan produk baru ke katalog toko Anda.
              </span>
            </span>
          </button>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => openTransaction("income")}
              className="group flex cursor-pointer flex-col items-start gap-3 rounded-xl border border-black/20 bg-white p-4 text-left transition-colors hover:border-black hover:bg-emerald-50/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <RiArrowUpCircleLine size={22} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-gray-900">
                  Tambah Pendapatan
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-gray-500">
                  Catat uang masuk dari penjualan, pesanan, atau jasa.
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => openTransaction("expense")}
              className="group flex cursor-pointer flex-col items-start gap-3 rounded-xl border border-black/20 bg-white p-4 text-left transition-colors hover:border-black hover:bg-rose-50/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <RiArrowDownCircleLine size={22} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-gray-900">
                  Tambah Pengeluaran
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-gray-500">
                  Catat biaya stok, operasional, gaji, dan lainnya.
                </span>
              </span>
            </button>
          </div>
        </div>
      ) : step === "product" ? (
        <ProductForm
          onBack={backToChoose}
          onCancel={onClose}
          onSave={onSaveProduct}
        />
      ) : (
        <TransactionForm
          type={type}
          onBack={backToChoose}
          onCancel={onClose}
          onSave={onSaveTransaction}
        />
      )}
    </PleasePop>
  );
}

/* ------------------------------------------------------------------ */
/* Formulir produk baru                                                */
/* ------------------------------------------------------------------ */

interface ProductFormValues {
  name: string;
  price: string;
  category: string;
  stock: string;
  description: string;
}

type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

const productInputClass = (invalid?: string) =>
  `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    invalid ? "border-rose-400" : "border-gray-300"
  }`;

function ProductForm({
  onBack,
  onCancel,
  onSave,
}: {
  onBack: () => void;
  onCancel: () => void;
  onSave: (input: NewProductInput) => void;
}) {
  const [values, setValues] = useState<ProductFormValues>({
    name: "",
    price: "",
    category: PRODUCT_CATEGORIES[0],
    stock: "",
    description: "",
  });
  const [errors, setErrors] = useState<ProductFormErrors>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      name: values.name.trim(),
      price: Math.round(Number(values.price)),
      category: values.category,
      stock: Math.round(Number(values.stock)),
      description: values.description.trim() || undefined,
    });
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

      {/* Aksi */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <RiArrowLeftLine size={16} />
          Kembali
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-xl border border-black bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 hard-shadow"
          >
            Simpan Produk
          </button>
        </div>
      </div>
    </form>
  );
}
