"use client";

// Dialog "Buat Baru" — tombol serbaguna untuk menambah produk atau transaksi.
// Memakai PleasePop, memakai ulang TransactionForm dan ProductForm.

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  RiArrowDownCircleLine,
  RiArrowUpCircleLine,
  RiBox3Line,
} from "@remixicon/react";
import PleasePop from "@/components/ui/please-pop";
import TransactionForm from "@/components/dashboard/transaction-form";
import ProductForm, {
  type NewProductInput,
} from "@/components/dashboard/product-form";
import {
  type NewFinanceTransaction,
  type TransactionType,
} from "@/lib/finance";

// Tetap diekspor dari sini demi kompatibilitas pemanggil lama.
export type { NewProductInput } from "@/components/dashboard/product-form";

type Step = "choose" | "product" | "transaction";

export interface CreateNewDialogProps {
  open: boolean;
  onClose: () => void;
  onSaveTransaction?: (input: NewFinanceTransaction) => void;
  onSaveProduct?: (input: NewProductInput) => void;
}

export default function CreateNewDialog({
  open,
  onClose,
  onSaveTransaction,
  onSaveProduct,
}: CreateNewDialogProps) {
  const router = useRouter();
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

  const handleSaveProduct = async (input: NewProductInput) => {
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: input.name,
          harga: input.price,
          stok: input.stock,
          deskripsi: input.description,
          kategori: input.category, // Kirim nama kategori untuk dicari ID-nya di backend
          gambarUrl: input.gambarUrl,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        // Tampilkan error spesifik dari server jika gagal
        console.error("Server Error Response:", resData);
        throw new Error(
          resData.details || resData.error || "Server Error",
        );
      }

      onSaveProduct?.(input);
      router.refresh();
      onClose();
    } catch (err) {
      console.error("Fetch Exception:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Tidak dapat terhubung ke Server API.",
      );
    }
  };

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
          showBack
          onBack={backToChoose}
          onCancel={onClose}
          onSubmit={handleSaveProduct}
        />
      ) : (
        <TransactionForm
          type={type}
          onBack={backToChoose}
          onCancel={onClose}
          onSave={onSaveTransaction ?? (() => {})}
        />
      )}
    </PleasePop>
  );
}
