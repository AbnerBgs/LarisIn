"use client";

import { useEffect, useRef, useState } from "react";
import {
  RiAlarmWarningFill,
  RiNotificationLine,
  RiSearchLine,
  RiShieldCheckFill,
  RiStore2Line,
} from "@remixicon/react";

export default function TopbarDashboard() {
  const [open, setOpen] = useState(false);
  const [storeName, setStoreName] = useState<string>("Initial");
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch nama toko pertama kali & dengarkan event update
  useEffect(() => {
    async function fetchStoreName() {
      try {
        // PERBAIKAN: Path API disesuaikan dengan nama folder (profileUmkm)
        const res = await fetch("/api/profileUmkm");
        if (res.ok) {
          const data = await res.json();
          if (data.name) setStoreName(data.name);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchStoreName();

    // Event listener saat profil di-save dari halaman EditProfile
    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.name) {
        setStoreName(customEvent.detail.name);
      }
    };

    window.addEventListener("profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, []);

  return (
    <section className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">
      <div className="flex items-center gap-3">
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700">
          <RiStore2Line size={16} />
          <span className="text-sm font-medium">{storeName}</span>
        </div>
      </div>
    </section>
  );
}