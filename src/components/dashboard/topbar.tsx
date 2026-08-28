"use client";

import { useState } from "react";
import { RiSearchLine } from "@remixicon/react";

export default function TopbarDashboard() {
  { /* Buat state untuk menyimpan bulan yang dipilih */ }
  const [selectedMonth, setSelectedMonth] = useState("Agustus");

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <section className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 md:px-8">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <RiSearchLine
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Cari"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-400">
          Ctrl + K
        </kbd>
      </div>

      {/* Dropdown Bulan */}
      <div className="ml-auto">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none cursor-pointer hover:bg-gray-50"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}