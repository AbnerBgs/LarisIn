"use client";

import { useEffect, useRef, useState } from "react";
import { RiAlarmWarningFill, RiNotificationLine, RiSearchLine, RiShieldCheckFill, RiStore2Line } from "@remixicon/react";

interface Notification {
  id: number,
  icon: number,
  title: string,
  desc: string,
  time: string
}

const notifications: Notification[] = [
  { id: 3, icon: 0, title: "Stok menipis", desc: "Produk \"Kopi Kapal Api\" hampir habis", time: "30 menit lalu" },
  { id: 2, icon: 0, title: "Stok menipis", desc: "Produk \"Kopi Gayo\" hampir habis", time: "1 jam lalu" },
  { id: 1, icon: 1, title: "Pembayaran diterima", desc: "Pembayaran #12340 berhasil", time: "3 jam lalu" },
];

export default function TopbarDashboard() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const icons = [
    <RiAlarmWarningFill size={16} className="mt-0.5 shrink-0 text-gray-500"/>,
    <RiShieldCheckFill size={16} className="mt-0.5 shrink-0 text-gray-500"/>
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
          ref={inputRef}
          placeholder="Cari"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-10 text-sm text-gray-700 placeholder-gray-400"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-400">
          Ctrl + K
        </kbd>
      </div>

      <div className="relative ml-auto">
        <button
          onClick={() => setOpen(!open)}
          className="relative flex gap-2 items-center rounded-lg border border-gray-200 bg-gray-50 py-2 px-2 placeholder-gray-400 cursor-pointer"
        >
          <RiNotificationLine size={16}/>
          {
            notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"/>
            )
          }
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border bg-white hard-shadow-static">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <span className="text-sm font-semibold text-gray-800">Notifikasi</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{notifications.length}</span>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <li key={n.id} className="flex gap-3 border-b border-gray-50 px-4 py-3 last:border-0 hover:bg-gray-50 cursor-pointer">
                    {
                      icons[n.icon]
                    }
                    <div>
                      <p className="text-sm font-medium text-gray-800">{n.title}</p>
                      <p className="text-xs text-gray-500">{n.desc}</p>
                      <p className="mt-1 text-[11px] text-gray-400">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      
      <div>
        <div className="flex gap-2 items-center rounded-lg border border-gray-200 bg-gray-50 py-2 px-4 placeholder-gray-400">
          <RiStore2Line size={16}/>
          <span className="text-sm font-medium">Toko Budi</span>
        </div>
      </div>
    </section>
  );
}