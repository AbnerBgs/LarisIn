// app/produk/produk-client.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import PleasePop from "@/components/ui/please-pop";
import { RiSearchLine } from "@remixicon/react";

// const products = [
//   {
//     id: 1,
//     name: "Kaos Polos Hitam",
//     price: 150000,
//     image: "https://picsum.photos/200/300",
//     description:
//       "Kaos polos premium 100% katun combed 30s. Nyaman dipakai sehari-hari.",
//     category: "Pakaian Pria",
//     stock: 25,
//   },
//   {
//     id: 2,
//     name: "Jaket Denim Biru",
//     price: 350000,
//     image: "https://picsum.photos/200/300",
//     description:
//       "Jaket denim klasik dengan bahan tebal dan nyaman. Cocok untuk gaya kasual.",
//     category: "Jaket",
//     stock: 10,
//   },
//   {
//     id: 3,
//     name: "Sepatu Sneakers Putih",
//     price: 450000,
//     image: "https://picsum.photos/200/300",
//     description:
//       "Sneakers putih minimalis dengan sol empuk. Bahan premium tahan lama.",
//     category: "Sepatu",
//     stock: 8,
//   },
//   {
//     id: 4,
//     name: "Kemeja Flanel Merah",
//     price: 250000,
//     image: "https://picsum.photos/200/300",
//     description: "Kemeja flanel bahan hangat dengan motif kotak-kotak klasik.",
//     category: "Pakaian Pria",
//     stock: 15,
//   },
//   {
//     id: 5,
//     name: "Tas Ransel Kanvas",
//     price: 180000,
//     image: "https://picsum.photos/200/300",
//     description: "Tas ransel kanvas premium dengan banyak kompartemen.",
//     category: "Aksesoris",
//     stock: 3,
//   },
// ];

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

export default function ProdukClient({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchQuery.trim().toLowerCase();
  const filteredProducts = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      )
    : products;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
            Produk
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredProducts.length} produk ditemukan
          </p>
        </div>

        <div className="relative mt-4">
          <RiSearchLine
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau deskripsi produk..."
            className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-black bg-white hard-shadow-static">
          {filteredProducts.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-500">
              Tidak ada produk yang cocok.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredProducts.map((p) => (
                <li
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 sm:px-5"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {p.name}
                      </p>
                      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                        {p.category}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {p.description}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-mono text-sm font-semibold text-gray-900">
                      {formatPrice(p.price)}
                    </p>
                    <p
                      className={`text-[11px] ${p.stock > 0 ? "text-gray-400" : "text-rose-500"}`}
                    >
                      {p.stock > 0 ? `Stok ${p.stock}` : "Habis"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>

      <PleasePop
        style="receipt-edge"
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name}
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="relative h-64 rounded-2xl bg-gray-200">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                className="object-cover rounded-xl"
              />
            </div>

            <div>
              <p className="text-2xl font-mono font-bold text-blue-500">
                {formatPrice(selectedProduct.price)}
              </p>
            </div>

            <div className="border-t border-dashed border-black/20 pt-3">
              <h3 className="font-semibold mb-1">Deskripsi</h3>
              <p className="text-gray-600">{selectedProduct.description}</p>
              <p className="mt-2 text-sm text-black font-mono bg-amber-300 w-fit px-2 rounded-xl border">
                {selectedProduct.category}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">Stok:</span>
              <span
                className={
                  selectedProduct.stock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {selectedProduct.stock > 0
                  ? `${selectedProduct.stock} tersisa`
                  : "Habis"}
              </span>
            </div>
          </div>
        )}
      </PleasePop>
    </div>
  );
}
