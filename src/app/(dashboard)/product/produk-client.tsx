"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CreateNewDialog from "@/components/dashboard/create-new-dialog";
import {
  RiArmchairLine,
  RiBowlLine,
  RiBox3Line,
  RiCupLine,
  RiDeleteBinLine,
  RiHeartPulseLine,
  RiImageLine,
  RiPencilLine,
  RiSearchLine,
  RiToolsLine,
  RiAddLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import PleasePop from "@/components/ui/please-pop";
import ProductForm, {
  type NewProductInput,
} from "@/components/dashboard/product-form";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  description: string;
  category: string;
  stock: number;
}

const CATEGORY_ICONS: Record<string, RemixiconComponentType> = {
  Makanan: RiBowlLine,
  Minuman: RiCupLine,
  Alat: RiToolsLine,
  Perawatan: RiHeartPulseLine,
  Perabotan: RiArmchairLine,
  Lainnya: RiBox3Line,
};

function CategoryIcon({
  category,
  className,
  iconSize = 18,
}: {
  category: string;
  className?: string;
  iconSize?: number;
}) {
  const Icon = CATEGORY_ICONS[category] ?? RiImageLine;
  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      <Icon size={iconSize} />
    </div>
  );
}

function ProductImage({
  product,
  failed,
  onError,
  className,
  iconSize = 18,
}: {
  product: Product;
  failed: boolean;
  onError: () => void;
  className: string;
  iconSize?: number;
}) {
  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {product.image && !failed ? (
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          onError={onError}
        />
      ) : (
        <CategoryIcon
          category={product.category}
          className="h-full w-full text-slate-500"
          iconSize={iconSize}
        />
      )}
    </div>
  );
}

export default function ProdukClient({
  products: initialProducts,
}: {
  products: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const [prevInitialProducts, setPrevInitialProducts] =
    useState(initialProducts);
  if (prevInitialProducts !== initialProducts) {
    setPrevInitialProducts(initialProducts);
    setProducts(initialProducts);
  }

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

  const markImageFailed = (id: string) =>
    setFailedImages((prev) => new Set(prev).add(id));

  const handleSaveEdit = async (input: NewProductInput) => {
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/product/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: input.name,
          harga: input.price,
          stok: input.stock,
          deskripsi: input.description,
          kategori: input.category, // Nama kategori, dicari ID-nya di backend
          gambarUrl: input.gambarUrl,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        console.error("Server Error Response:", resData);
        throw new Error(resData.details || resData.error || "Server Error");
      }

      const updated: Product = {
        id: resData.id,
        name: resData.nama,
        price: resData.harga,
        image: resData.gambarUrl,
        description: resData.deskripsi ?? "",
        category: resData.kategori?.nama ?? "Tanpa Kategori",
        stock: resData.stok,
      };

      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
      setSelectedProduct((current) =>
        current?.id === updated.id ? updated : current,
      );
      setFailedImages((prev) => {
        if (!prev.has(updated.id)) return prev;
        const next = new Set(prev);
        next.delete(updated.id);
        return next;
      });
      setEditingProduct(null);
    } catch (err) {
      console.error("Fetch Exception:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Tidak dapat terhubung ke Server API.",
      );
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      const response = await fetch(`/api/product/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const resData = await response.json().catch(() => null);
        throw new Error(resData?.error || "Gagal menghapus produk");
      }

      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setSelectedProduct((current) =>
        current?.id === product.id ? null : current,
      );
      setEditingProduct((current) =>
        current?.id === product.id ? null : current,
      );
    } catch (err) {
      console.error("Fetch Exception:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Tidak dapat terhubung ke Server API.",
      );
    }
  };

  const [createOpen, setCreateOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "n") {
        e.preventDefault();
        setCreateOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const openDeleteConfirmation = (product: Product) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteOpen(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    const product = productToDelete;
    closeDeleteConfirmation();
    await handleDelete(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
              Produk
            </h1>
            <div className="px-4 pt-4">
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <RiAddLine size={16} />
                  Tambah Product
                </span>
              </button>
            </div>
          </div>
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
              {query
                ? "Tidak ada produk yang cocok."
                : 'Belum ada produk. Klik tombol "Buat Baru" di sidebar untuk menambah produk.'}
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredProducts.map((p) => (
                <li
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 sm:px-5"
                >
                  <ProductImage
                    product={p}
                    failed={failedImages.has(p.id)}
                    onError={() => markImageFailed(p.id)}
                    className="h-10 w-10 shrink-0 rounded-lg"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-md font-medium text-gray-900">
                        {p.name}
                      </p>
                      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[12px] font-medium text-gray-600">
                        {p.category}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      {p.description || "Tidak ada deskripsi"}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-mono text-md font-semibold text-gray-900">
                      {formatPrice(p.price)}
                    </p>
                    <p
                      className={`text-[14px] ${p.stock > 0 ? "text-gray-400" : "text-rose-500"}`}
                    >
                      {p.stock > 0 ? `Stok ${p.stock}` : "Habis"}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${p.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProduct(p);
                      }}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      <RiPencilLine size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Hapus ${p.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteConfirmation(p);
                      }}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                      <RiDeleteBinLine size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>

      {/* Detail produk */}
      <PleasePop
        style="receipt-edge"
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name}
      >
        {selectedProduct && (
          <div className="space-y-4">
            <ProductImage
              product={selectedProduct}
              failed={failedImages.has(selectedProduct.id)}
              onError={() => markImageFailed(selectedProduct.id)}
              className="h-64 rounded-xl"
              iconSize={44}
            />

            <div>
              <p className="text-2xl font-mono font-bold text-blue-500">
                {formatPrice(selectedProduct.price)}
              </p>
            </div>

            <div className="border-t border-dashed border-black/20 pt-3">
              <h3 className="font-semibold mb-1">Deskripsi</h3>
              <p className="text-gray-600">
                {selectedProduct.description || "Tidak ada deskripsi"}
              </p>
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

            <div className="flex gap-3 border-t border-dashed border-black/20 pt-4">
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-black bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-blue-50"
              >
                <RiPencilLine size={16} />
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  openDeleteConfirmation(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100"
              >
                <RiDeleteBinLine size={16} />
                Hapus
              </button>
            </div>
          </div>
        )}
      </PleasePop>

      {/* POP UP CONFIRM DELETE */}
      <PleasePop
        style="hard-shadow"
        isOpen={deleteOpen}
        onClose={closeDeleteConfirmation}
        title="Hapus Produk?"
      >
        {productToDelete && (
          <div className="space-y-4">
            <p className="text-,d text-gray-600">
              Produk{" "}
              <span className="font-semibold text-gray-900">
                {productToDelete.name}
              </span>{" "}
              akan dihapus secara permanen.
            </p>
            <div className="flex gap-3 border-t border-dashed border-black/20 pt-4">
              <button
                type="button"
                onClick={closeDeleteConfirmation}
                className="flex flex-1 cursor-pointer hard-shadow items-center justify-center rounded-xl border border-black bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                className="flex flex-1 hard-shadow cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100"
              >
                <RiDeleteBinLine size={16} />
                Hapus
              </button>
            </div>
          </div>
        )}
      </PleasePop>

      {/* Edit produk */}
      <PleasePop
        style="hard-shadow"
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Edit Produk"
      >
        {editingProduct && (
          <ProductForm
            initial={{
              name: editingProduct.name,
              price: String(editingProduct.price),
              category: editingProduct.category,
              stock: String(editingProduct.stock),
              description: editingProduct.description,
              gambarUrl: editingProduct.image,
            }}
            submitLabel="Simpan Perubahan"
            onCancel={() => setEditingProduct(null)}
            onSubmit={handleSaveEdit}
          />
        )}
      </PleasePop>

      <CreateNewDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaveProduct={() => {
          // Produk sudah disimpan ke API di dalam ProductForm.
          setCreateOpen(false);
        }}
      />
    </div>
  );
}
