"use client";

import { useState } from "react";
// import { RiAddLine, RiDeleteBinLine } from '@remixicon/react';
import ProductCombobox from "@/components/dashboard/product-combobox";
import OrderReceipt from "@/components/dashboard/order-receipt";
import type { Product } from "@/app/(dashboard)/orders/product";
import { RiAddLine, RiDeleteBinLine } from "@remixicon/react";

interface OrderItem {
  id: string;
  productId: number | null;
  productName: string;
  price: number;
  quantity: number;
}

interface OrderFormData {
  paymentType: string;
  items: OrderItem[];
}

const PAYMENT_TYPES = [
  { value: "qris", label: "QRIS" },
  { value: "cash", label: "Cash" },
  { value: "debit", label: "Debit" },
];

const createEmptyItem = (): OrderItem => ({
  id: crypto.randomUUID(),
  productId: null,
  productName: "",
  price: 0,
  quantity: 1,
});

export default function OrdersPage() {
  const [formData, setFormData] = useState<OrderFormData>({
    paymentType: "qris",
    items: [createEmptyItem()],
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyItem()],
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== itemId),
    }));
  };

  const handleSelectProduct = (itemId: string, product: Product) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              productId: product.id,
              productName: product.name,
              price: product.price,
            }
          : item,
      ),
    }));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    }));
  };

  const total = formData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order data:", formData);
    window.print();
  };

  const [orderNumber] = useState(
    () =>
      `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* FORM */}
          <div className="group bg-white w-full rounded-2xl border border-black hard-shadow-static overflow-hidden">
            <div className="relative h-auto p-5">
              <h1 className="font-semibold text-xl">New Order</h1>
              <p className="text-md">Fill in the order details below</p>
              <form
                onSubmit={handleSubmit}
                className=" rounded-2xl mt-5 max-w-2xl mx-auto print:hidden"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1.5">
                      Payment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.paymentType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentType: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {PAYMENT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-800">
                        Products <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        <RiAddLine size={14} />
                        Tambah Produk
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-2 rounded-lg border border-gray-200 p-3"
                        >
                          <div className="flex-1 space-y-2">
                            <ProductCombobox
                              value={item.productName}
                              onSelect={(product) =>
                                handleSelectProduct(item.id, product)
                              }
                            />
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <label className="text-xs text-gray-500">
                                  Jumlah
                                </label>
                                <input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.id,
                                      Number(e.target.value),
                                    )
                                  }
                                  className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              {item.price > 0 && (
                                <span className="font-mono text-sm text-gray-600">
                                  {formatPrice(item.price)} x {item.quantity} ={" "}
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              )}
                            </div>
                          </div>

                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="mt-1 text-gray-400 hover:text-red-500"
                            >
                              <RiDeleteBinLine size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
                    <span className="text-sm font-semibold text-gray-800">
                      Total
                    </span>
                    <span className="font-mono font-bold text-gray-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-red-500 mt-5">* Required fields</p>
              </form>
            </div>
          </div>

          {/* STRUK */}
          <div className="group bg-white w-full h-full rounded-2xl border border-black hard-shadow-static overflow-hidden">
            <div className="relative h-auto p-5 print:hidden">
              <h1 className="font-semibold text-xl">Receipt</h1>
              <p className="text-md">Preview struk secara real-time</p>
            </div>

            <OrderReceipt
              orderNumber={orderNumber}
              paymentType={formData.paymentType}
              items={formData.items}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
