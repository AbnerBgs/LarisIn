// app/products/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import PleasePop from '@/components/ui/please-pop';
import { RiArrowRightDownLine, RiArrowRightLine, RiArrowRightUpLine } from '@remixicon/react';

// Data produk (biasanya dari API)
const products = [
  {
    id: 1,
    name: 'Kaos Polos Hitam',
    price: 150000,
    image: 'https://picsum.photos/200/300',
    description: 'Kaos polos premium 100% katun combed 30s. Nyaman dipakai sehari-hari.',
    category: 'Pakaian Pria',
    stock: 25,
  },
  {
    id: 2,
    name: 'Jaket Denim Biru',
    price: 350000,
    image: 'https://picsum.photos/200/300',
    description: 'Jaket denim klasik dengan bahan tebal dan nyaman. Cocok untuk gaya kasual.',
    category: 'Jaket',
    stock: 10,
  },
  {
    id: 3,
    name: 'Sepatu Sneakers Putih',
    price: 450000,
    image: 'https://picsum.photos/200/300',
    description: 'Sneakers putih minimalis dengan sol empuk. Bahan premium tahan lama.',
    category: 'Sepatu',
    stock: 8,
  },
];

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">DAFTAR PRODUK</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-black hard-shadow overflow-hidden cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative h-48 bg-slate-100 border-b border-black overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-white border border-black rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                {product.stock <= 10 && (
                  <span
                    className={`absolute top-3 right-3 border-2 border-black rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      product.stock === 0 ? 'bg-rose-400' : 'bg-amber-300'
                    }`}
                  >
                    {product.stock === 0 ? 'Habis' : `Sisa ${product.stock}`}
                  </span>
                )}
              </div>

              <div className="p-4">
                <h2 className="font-bold text-lg leading-snug mb-1.5">{product.name}</h2>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{product.description}</p>
                <div className="flex items-center justify-between border-t border-dashed border-black/20 pt-3">
                  <span className="font-mono font-bold text-slate-900">{formatPrice(product.price)}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition-transform duration-200 group-hover:translate-x-1">
                    Detail
                    <RiArrowRightLine />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PopUp Detail Produk */}
      <PleasePop
        style='receipt-edge'
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name}
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="relative h-64 bg-gray-200 rounded-lg">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            
            <div>
              <p className="text-2xl font-mono font-bold text-blue-500">
                {formatPrice(selectedProduct.price)}
              </p>
            </div>

            <div className='border-t border-dashed border-black/20 pt-3'>
              <h3 className="font-semibold mb-1">Deskripsi</h3>
              <p className="text-gray-600">{selectedProduct.description}</p>
              <p className="mt-2 text-sm text-black font-mono bg-amber-300 w-fit px-2 rounded-xl border">{selectedProduct.category}</p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">Stok:</span>
              <span className={selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {selectedProduct.stock > 0 ? `${selectedProduct.stock} tersisa` : 'Habis'}
              </span>
            </div>
          </div>
        )}
      </PleasePop>
    </div>
  );
}