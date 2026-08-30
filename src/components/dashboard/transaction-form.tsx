"use client";

// Formulir transaksi (pendapatan/pengeluaran) yang dipakai bersama oleh
// AddTransactionDialog dan CreateNewDialog.

import { useEffect, useRef, useState } from "react";
import { RiArrowLeftLine } from "@remixicon/react";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  todayISO,
  type NewFinanceTransaction,
  type TransactionType,
} from "@/lib/finance";

interface FormValues {
  description: string;
  amount: string;
  category: string;
  date: string;
  note: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const defaultValues = (type: TransactionType): FormValues => ({
  description: "",
  amount: "",
  category: type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
  date: todayISO(),
  note: "",
});

const inputClass = (invalid?: string) =>
  `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    invalid ? "border-rose-400" : "border-gray-300"
  }`;

export default function TransactionForm({
  type,
  onBack,
  onCancel,
  onSave,
}: {
  type: TransactionType;
  onBack: () => void;
  onCancel: () => void;
  onSave: (input: NewFinanceTransaction) => void;
}) {
  const [values, setValues] = useState<FormValues>(() => defaultValues(type));
  const [errors, setErrors] = useState<FormErrors>({});

  const firstFieldRef = useRef<HTMLInputElement>(null);

  const isIncome = type === "income";
  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Fokus awal pada deskripsi saat formulir tampil.
  useEffect(() => {
    requestAnimationFrame(() => firstFieldRef.current?.focus());
  }, []);

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!values.description.trim()) {
      next.description = "Deskripsi wajib diisi.";
    }
    const amount = Number(values.amount);
    if (!values.amount.trim() || Number.isNaN(amount) || amount <= 0) {
      next.amount = "Jumlah harus lebih dari 0.";
    }
    if (!values.category) {
      next.category = "Pilih kategori.";
    }
    if (!values.date) {
      next.date = "Tanggal wajib diisi.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      type,
      description: values.description.trim(),
      amount: Math.round(Number(values.amount)),
      category: values.category,
      date: values.date,
      note: values.note.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="tx-description"
            className="mb-1.5 block text-sm font-medium text-gray-800"
          >
            Deskripsi <span className="text-rose-500">*</span>
          </label>
          <input
            id="tx-description"
            ref={firstFieldRef}
            type="text"
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder={
              isIncome ? "contoh: Penjualan Toko" : "contoh: Restok Barang"
            }
            aria-required="true"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "tx-description-error" : undefined
            }
            className={inputClass(errors.description)}
          />
          {errors.description && (
            <p id="tx-description-error" className="mt-1 text-xs text-rose-600">
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="tx-amount"
            className="mb-1.5 block text-sm font-medium text-gray-800"
          >
            Jumlah (Rp) <span className="text-rose-500">*</span>
          </label>
          <input
            id="tx-amount"
            type="number"
            min={1}
            step="any"
            inputMode="decimal"
            value={values.amount}
            onChange={(e) => setField("amount", e.target.value)}
            placeholder="0"
            aria-required="true"
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? "tx-amount-error" : undefined}
            className={inputClass(errors.amount)}
          />
          {errors.amount && (
            <p id="tx-amount-error" className="mt-1 text-xs text-rose-600">
              {errors.amount}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="tx-category"
            className="mb-1.5 block text-sm font-medium text-gray-800"
          >
            Kategori <span className="text-rose-500">*</span>
          </label>
          <select
            id="tx-category"
            value={values.category}
            onChange={(e) => setField("category", e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.category)}
            aria-describedby={
              errors.category ? "tx-category-error" : undefined
            }
            className={`${inputClass(errors.category)} cursor-pointer`}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p id="tx-category-error" className="mt-1 text-xs text-rose-600">
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="tx-date"
            className="mb-1.5 block text-sm font-medium text-gray-800"
          >
            Tanggal <span className="text-rose-500">*</span>
          </label>
          <input
            id="tx-date"
            type="date"
            value={values.date}
            onChange={(e) => setField("date", e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "tx-date-error" : undefined}
            className={inputClass(errors.date)}
          />
          {errors.date && (
            <p id="tx-date-error" className="mt-1 text-xs text-rose-600">
              {errors.date}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="tx-note"
            className="mb-1.5 block text-sm font-medium text-gray-800"
          >
            Catatan <span className="text-gray-400">(opsional)</span>
          </label>
          <textarea
            id="tx-note"
            rows={3}
            value={values.note}
            onChange={(e) => setField("note", e.target.value)}
            placeholder="Tambahkan catatan bila perlu"
            className={`${inputClass()} resize-none`}
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
            Simpan Transaksi
          </button>
        </div>
      </div>
    </form>
  );
}
