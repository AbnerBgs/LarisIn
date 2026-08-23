"use client";

import { useState } from "react";
import { RiFileTextLine } from "@remixicon/react";
import * as XLSX from "xlsx";

interface Transaction {
  orderId: string;
  date: string;
  total: number;
  paymentMethod: string;
  receiptUrl?: string;
}

export default function Penjualan() {
  // NANTI DIGANTI AMA DB
  const [transactions] = useState<Transaction[]>([
    {
      orderId: "INV-001",
      date: "2026-08-01",
      total: 150000,
      paymentMethod: "QRIS",
      receiptUrl: "#",
    },
    {
      orderId: "INV-002",
      date: "2026-08-02",
      total: 275000,
      paymentMethod: "Cash",
      receiptUrl: "#",
    },
  ]);

  const handleExport = () => {
    const exportData = transactions.map((t) => ({
      "Order ID": t.orderId,
      "Tanggal Transaksi": t.date,
      Total: t.total,
      "Payment Method": t.paymentMethod,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // LEBAR KOLOM DI EXCEL
    worksheet["!cols"] = [{ wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 18 }];

    XLSX.writeFile(workbook, `transactions_${Date.now()}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-7">
      <section className="mx-auto group border border-black hard-shadow-static max-w-7xl px-4 py-6 md:px-8 md:py-8 md:pb-8 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-[#E2E8F0] flex justify-between items-center">
          <h3 className="font-bold text-xl text-[#0F172A]">
            Recent Transactions
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
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Tanggal Transaksi</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Payment Method</th>
                <th className="py-4 px-6">Receipt</th>
              </tr>
            </thead>
            <tbody
              id="tableBody"
              className="divide-y divide-[#E2E8F0] text-sm text-[#334155]"
            >
              {transactions.map((t) => (
                <tr key={t.orderId}>
                  <td className="py-3 px-6">{t.orderId}</td>
                  <td className="py-3 px-6">{t.date}</td>
                  <td className="py-3 px-6">
                    Rp{t.total.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-6">{t.paymentMethod}</td>
                  <td className="py-3 px-6">
                    {t.receiptUrl ? (
                      <a
                        href={t.receiptUrl}
                        className="text-[#10B981] underline"
                      >
                        Lihat
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
