"use client";

// Dialog "Target Pendapatan" untuk halaman Keuangan.
// Mengatur target pendapatan bulanan yang ingin dicapai.

import { useEffect, useRef, useState } from "react";
import { RiFlagLine } from "@remixicon/react";
import PleasePop from "@/components/ui/please-pop";
import { formatIDR } from "@/lib/finance";

export default function TargetDialog({
  open,
  currentTarget,
  onClose,
  onSave,
}: {
  open: boolean;
  currentTarget: number;
  onClose: () => void;
  onSave: (amount: number) => Promise<void> | void;
}) {
  const [amount, setAmount] = useState<string>(
    currentTarget > 0 ? String(currentTarget) : "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => firstFieldRef.current?.focus());
  }, []);

  const parsed = Number(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount.trim() || Number.isNaN(parsed) || parsed <= 0) {
      alert("Target harus berupa angka lebih dari 0.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(Math.round(parsed));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PleasePop isOpen={open} onClose={onClose} title="Target Pendapatan">
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Atur target pendapatan bulanan yang ingin dicapai. Target ini akan
            ditampilkan di grafik halaman Keuangan dan Dashboard.
          </p>

          <label className="block text-sm font-medium text-gray-800">
            Target pendapatan bulanan (Rp)
            <input
              ref={firstFieldRef}
              type="number"
              min={1}
              step="any"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="contoh: 10000000"
              aria-required="true"
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {!Number.isNaN(parsed) && parsed > 0 && (
            <p className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 font-mono text-sm text-indigo-700">
              <RiFlagLine size={16} />
              Target bulanan: {formatIDR(parsed)}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer rounded-xl border border-black bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 hard-shadow disabled:opacity-50"
          >
            {isSaving ? "Menyimpan..." : "Simpan Target"}
          </button>
        </div>
      </form>
    </PleasePop>
  );
}
