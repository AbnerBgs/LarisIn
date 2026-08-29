"use client";

// Dialog "Tambah Transaksi" untuk halaman Keuangan.
// Dua langkah: pilih jenis (pendapatan/pengeluaran), lalu isi formulir.
// Aksesibel: role dialog, focus trap, Escape, fokus kembali ke pemicu.

import { useEffect, useRef, useState } from "react";
import {
  RiArrowDownCircleLine,
  RiArrowLeftLine,
  RiArrowUpCircleLine,
  RiCloseLine,
} from "@remixicon/react";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  todayISO,
  type NewFinanceTransaction,
  type TransactionType,
} from "@/lib/finance";

type Step = "choose" | "form";

interface FormValues {
  description: string;
  amount: string;
  category: string;
  date: string;
  note: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[href]",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

const defaultValues = (type: TransactionType): FormValues => ({
  description: "",
  amount: "",
  category:
    type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
  date: todayISO(),
  note: "",
});

export default function AddTransactionDialog({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (input: NewFinanceTransaction) => void;
}) {
  const [step, setStep] = useState<Step>("choose");
  const [type, setType] = useState<TransactionType>("income");
  const [values, setValues] = useState<FormValues>(() =>
    defaultValues("income"),
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  /* Fokus awal + kunci scroll saat dibuka, dan kembalikan fokus ke elemen
     pemicu saat ditutup. State formulir selalu bersih karena komponen
     di-mount ulang setiap kali dialog dibuka (lihat halaman finance). */
  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
      previousFocus?.focus?.();
    };
  }, [open]);

  /* Escape menutup dialog. */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  /* Jebak fokus Tab di dalam dialog. */
  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const startForm = (nextType: TransactionType) => {
    setType(nextType);
    setValues(defaultValues(nextType));
    setErrors({});
    setStep("form");
    requestAnimationFrame(() => firstFieldRef.current?.focus());
  };

  const backToChoose = () => {
    setErrors({});
    setStep("choose");
    panelRef.current?.focus();
  };

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

  if (!open) return null;

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isIncome = type === "income";
  const dialogTitle =
    step === "choose"
      ? "Tambah Transaksi"
      : isIncome
        ? "Tambah Pendapatan"
        : "Tambah Pengeluaran";

  const inputClass = (invalid?: string) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      invalid ? "border-rose-400" : "border-gray-300"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-transaction-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handlePanelKeyDown}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-black bg-white outline-none animate-fade-up hard-shadow-static"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-black/10 bg-white p-4">
          <h2
            id="add-transaction-title"
            className="text-lg font-bold leading-snug text-gray-900"
          >
            {dialogTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="ml-auto flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        <div className="p-5">
          {step === "choose" ? (
            /* Langkah 1: pilih jenis transaksi */
            <div>
              <p id="add-transaction-desc" className="text-sm text-gray-500">
                Pilih jenis transaksi yang ingin Anda catat.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => startForm("income")}
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
                  onClick={() => startForm("expense")}
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
          ) : (
            /* Langkah 2: formulir transaksi */
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
                    <p
                      id="tx-description-error"
                      className="mt-1 text-xs text-rose-600"
                    >
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
                    <p
                      id="tx-category-error"
                      className="mt-1 text-xs text-rose-600"
                    >
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
                  onClick={backToChoose}
                  className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  <RiArrowLeftLine size={16} />
                  Kembali
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
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
          )}
        </div>
      </div>
    </div>
  );
}
