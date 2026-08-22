import { RiArrowDownSLine, RiSearchLine } from "@remixicon/react";

export default function TopbarDashboard() {
  return (
    <>
      <section className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 md:px-8">
        <div className="relative flex-1 max-w-sm">
          <RiSearchLine
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-gray-300 focus:bg-white"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-400">
            Ctrl + K
          </kbd>
        </div>

        <button
          type="button"
          className="ml-auto flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Agustus
          <RiArrowDownSLine size={16} className="text-gray-400" />
        </button>
      </section>
    </>
  )
}