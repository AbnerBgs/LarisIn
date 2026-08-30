"use client";

// Dialog "Tambah Transaksi" untuk halaman Keuangan.
// Dua langkah: pilih jenis (pendapatan/pengeluaran), lalu isi formulir.
// Formulir dipakai bersama dengan CreateNewDialog (lihat TransactionForm).

import { useState } from "react";
import {
  RiArrowDownCircleLine,
  RiArrowUpCircleLine,
} from "@remixicon/react";
import PleasePop from "@/components/ui/please-pop";
import TransactionForm from "@/components/dashboard/transaction-form";
import {
  type NewFinanceTransaction,
  type TransactionType,
} from "@/lib/finance";

type Step = "choose" | "form";

export interface AddTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: NewFinanceTransaction) => void;
}

export default function AddTransactionDialog({
  open,
  onClose,
  onSave,
}: AddTransactionDialogProps) {
  const [step, setStep] = useState<Step>("choose");
  const [type, setType] = useState<TransactionType>("income");

  const startForm = (nextType: TransactionType) => {
    setType(nextType);
    setStep("form");
  };

  const backToChoose = () => setStep("choose");

  const dialogTitle =
    step === "choose"
      ? "Tambah Transaksi"
      : type === "income"
        ? "Tambah Pendapatan"
        : "Tambah Pengeluaran";

  return (
    <PleasePop isOpen={open} onClose={onClose} title={dialogTitle}>
      {step === "choose" ? (
        /* Langkah 1: pilih jenis transaksi */
        <div>
          <p className="text-sm text-gray-500">
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
        <TransactionForm
          type={type}
          onBack={backToChoose}
          onCancel={onClose}
          onSave={onSave}
        />
      )}
    </PleasePop>
  );
}