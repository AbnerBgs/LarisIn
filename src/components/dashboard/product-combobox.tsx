"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/app/(dashboard)/orders/product";

interface ProductComboboxProps {
  value: string;
  products: Product[];
  onSelect: (product: Product) => void;
}

export default function ProductCombobox({
  value,
  products = [],
  onSelect,
}: ProductComboboxProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("[data-combobox-list]")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateCoords = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const results =
    query.length > 0
      ? products.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        )
      : products;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          updateCoords();
          setIsOpen(true);
        }}
        onFocus={() => {
          updateCoords();
          setIsOpen(true);
        }}
        placeholder="Cari nama produk..."
        className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            data-combobox-list
            style={{
              position: "absolute",
              top: coords.top + 4,
              left: coords.left,
              width: coords.width,
              zIndex: 9999,
            }}
            className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            {results.length === 0 && (
              <div className="px-3.5 py-2.5 text-sm text-gray-400">
                Produk tidak ditemukan
              </div>
            )}
            {results.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  setQuery(product.name);
                  onSelect(product);
                  setIsOpen(false);
                }}
                className="flex w-full items-center justify-between px-3.5 py-2.5 text-sm text-left hover:bg-gray-50"
              >
                <span>{product.name}</span>
                <span className="font-mono text-gray-500">
                  {formatPrice(product.price)}
                </span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
