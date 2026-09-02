"use client";

// Dialog "Buat Baru" — tombol serbaguna untuk menambah produk atau transaksi.
// Memakai PleasePop, memakai ulang TransactionForm dan ProductForm.

import { useRouter } from "next/navigation";
import PleasePop from "@/components/ui/please-pop";
import ProductForm, {
  type NewProductInput,
} from "@/components/dashboard/product-form";

// Tetap diekspor dari sini demi kompatibilitas pemanggil lama.
export type { NewProductInput } from "@/components/dashboard/product-form";

export interface CreateNewDialogProps {
  open: boolean;
  onClose: () => void;
  onSaveProduct?: (input: NewProductInput) => void;
}

export default function CreateNewDialog({
  open,
  onClose,
  onSaveProduct,
}: CreateNewDialogProps) {
  const router = useRouter();

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
    <PleasePop isOpen={open} onClose={onClose} title="Tambah Produk">
      <ProductForm
        onCancel={onClose}
        onSubmit={handleSaveProduct}
      />
    </PleasePop>
  );
}
