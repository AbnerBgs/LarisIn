"use client";

import { useEffect, useState } from "react";
import { RiFileTextLine } from "@remixicon/react";
import * as XLSX from "xlsx";

type SaleRow = {
  orderId: string;
  date: string;
  cashierName: string;
  total: number;
  paymentMethod: string;
};

export default function PenjualanPage() {
  const [transactions, setTransactions] = useState<SaleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Gagal mengambil data transaksi");
        const data = await res.json();
        setTransactions(data.sales ?? []);
      } catch (error) {
        console.error(error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Gagal mengambil data transaksi");
      const data = await res.json();
      setTransactions(data.sales ?? []);
    } catch (error) {
      console.error(error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    const confirmed = window.confirm(`Hapus transaksi ${orderId}?`);
    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/orders?orderNumber=${encodeURIComponent(orderId)}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus transaksi");
      }

      await loadSales();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Gagal menghapus transaksi",
      );
    }
  };

  const handleExport = () => {
    const exportData = transactions.map((t) => ({
      "Order ID": t.orderId,
      "Tanggal Transaksi": t.date,
      Kasir: t.cashierName,
      Total: t.total,
      "Payment Method": t.paymentMethod,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 18 },
      { wch: 15 },
      { wch: 18 },
    ];

    XLSX.writeFile(workbook, `transactions_${Date.now()}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-7">
      <section className="mx-auto group border border-black hard-shadow-static max-w-7xl px-4 py-6 md:px-8 md:pb-8 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-[#E2E8F0] flex justify-between items-center">
          <h3 className="font-bold uppercase text-xl md:text-2xl text-[#0F172A]">
            riwayat transaksi
          </h3>
          <button
            type="button"
            onClick={handleExport}
            className="border border-black hard-shadow ml-auto flex-1 sm:flex-initial bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
          >
            <RiFileTextLine size={16} className="text-white" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Tanggal Transaksi</th>
                <th className="py-4 px-6">Kasir</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Metode Pembayaran</th>
                <th className="py-4 px-6">Hapus Transaksi</th>
              </tr>
            </thead>
            <tbody
              id="tableBody"
              className="divide-y divide-[#E2E8F0] text-sm text-[#334155]"
            >
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 px-6 text-center text-gray-500"
                  >
                    Memuat transaksi...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 px-6 text-center text-gray-500"
                  >
                    Belum ada transaksi.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.orderId}>
                    <td className="py-3 px-6">{t.orderId}</td>
                    <td className="py-3 px-6">{t.date}</td>
                    <td className="py-3 uppercase px-6">
                      {t.cashierName || "-"}
                    </td>
                    <td className="py-3 px-6">
                      Rp{t.total.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 uppercase px-6">{t.paymentMethod}</td>
                    <td className="py-3 px-6">
                      <button
                        type="button"
                        onClick={() => handleDelete(t.orderId)}
                        className="rounded-md border border-black hard-shadow bg-red-600 px-2 py-1 text-xs font-semibold text-white transition hover:bg-red-800"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
