// app/products/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import PleasePop from '@/components/ui/please-pop';
import { RiArrowRightLine, RiSearchLine, RiFilter3Line } from '@remixicon/react';

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
  {
    id: 4,
    name: 'Kemeja Flanel Merah',
    price: 250000,
    image: 'https://picsum.photos/200/300',
    description: 'Kemeja flanel bahan hangat dengan motif kotak-kotak klasik.',
    category: 'Pakaian Pria',
    stock: 15,
  },
  {
    id: 5,
    name: 'Tas Ransel Kanvas',
    price: 180000,
    image: 'https://picsum.photos/200/300',
    description: 'Tas ransel kanvas premium dengan banyak kompartemen.',
    category: 'Aksesoris',
    stock: 3,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [stockRange, setStockRange] = useState<[number, number]>([0, 100]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    return ['Semua', ...new Set(cats)];
  }, []);

  // Filter
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category
      const matchCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
      
      // Price range
      const matchPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Stock range
      const matchStock = product.stock >= stockRange[0] && product.stock <= stockRange[1];
      
      return matchSearch && matchCategory && matchPrice && matchStock;
    });
  }, [searchQuery, selectedCategory, priceRange, stockRange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setPriceRange([0, 500000]);
    setStockRange([0, 100]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden sticky top-16 z-10 bg-white border-b border-black p-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl font-semibold"
        >
          <RiFilter3Line />
          {isFilterOpen ? 'Tutup Filter' : 'Buka Filter'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row mx-auto p-4 lg:p-6 gap-6">
        {/* Sidebar Filter - Sticky */}
        <div className={`
          sticky z-10 top-40 lg:self-start
          lg:w-72 lg:min-w-[288px] lg:max-h-[calc(100vh-3rem)]
          ${isFilterOpen ? 'block' : 'hidden lg:block'}
        `}>
          <div className="bg-white border border-black hard-shadow-static p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-6rem)]">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Filter Produk</h2>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-semibold mb-2">Cari Produk</label>
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama atau deskripsi..."
                  className="w-full pl-9 pr-3 py-2 border border-black rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2">Kategori</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                      px-3 py-1.5 text-xs font-semibold rounded-full border border-black transition-all
                      ${selectedCategory === cat 
                        ? 'bg-black text-white' 
                        : 'bg-white hover:bg-gray-50'}
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Range Harga: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={10000}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full accent-black"
                />
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={10000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-black"
                />
              </div>
            </div>

            {/* Stock Range */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Range Stok: {stockRange[0]} - {stockRange[1]}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={stockRange[0]}
                  onChange={(e) => setStockRange([Number(e.target.value), stockRange[1]])}
                  className="w-full accent-black"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={stockRange[1]}
                  onChange={(e) => setStockRange([stockRange[0], Number(e.target.value)])}
                  className="w-full accent-black"
                />
              </div>
            </div>

            {/* Result count */}
            <div className="pt-4 border-t border-black/10">
              <p className="text-sm text-gray-600">
                Menampilkan <span className="font-bold text-black">{filteredProducts.length}</span> produk
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold">DAFTAR PRODUK</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredProducts.length} produk ditemukan
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-black p-12 text-center">
              <p className="text-gray-500">Tidak ada produk yang sesuai dengan filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
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
                    <h2 className="font-bold text-lg leading-snug mb-1.5 line-clamp-1">{product.name}</h2>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between border-t border-dashed border-black/20 pt-3">
                      <span className="font-mono font-bold text-slate-900">{formatPrice(product.price)}</span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition-transform duration-200 group-hover:translate-x-1">
                        Detail
                        <RiArrowRightLine className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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