"use client";

import { useEffect, useRef, useState } from "react";
import ProductCombobox from "@/components/dashboard/product-combobox";
import OrderReceipt from "@/components/dashboard/order-receipt";
import type { Product } from "@/app/(dashboard)/orders/product";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiRefreshLine,
  RiUserLine,
} from "@remixicon/react";

interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  price: number;
  quantity: number;
}

interface OrderFormData {
  cashierName: string;
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

interface OrdersFormProps {
  products: Product[];
  /** Jumlah pelanggan yang sudah dilayani kasir hari ini (dari server). */
  todayServed?: number;
}

let orderSequence = 0;

export default function OrdersForm({ products, todayServed }: OrdersFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    cashierName: "",
    paymentType: "qris",
    items: [createEmptyItem()],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [todayServedCount, setTodayServedCount] = useState(todayServed ?? 0);
  const orderNumberRef = useRef("");

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

  const createOrderNumber = () => {
    orderSequence += 1;
    const timestamp = new Date();
    const stamp = [
      timestamp.getFullYear(),
      String(timestamp.getMonth() + 1).padStart(2, "0"),
      String(timestamp.getDate()).padStart(2, "0"),
      String(timestamp.getHours()).padStart(2, "0"),
      String(timestamp.getMinutes()).padStart(2, "0"),
      String(timestamp.getSeconds()).padStart(2, "0"),
    ].join("");

    return `ORD-${stamp}-${String(orderSequence).padStart(4, "0")}`;
  };

  const saveOrder = async (nextOrderNumber?: string) => {
    if (isSaving) return null;

    const finalOrderNumber =
      nextOrderNumber || orderNumberRef.current || createOrderNumber();
    orderNumberRef.current = finalOrderNumber;
    setOrderNumber(finalOrderNumber);

    const payload = {
      cashierName: formData.cashierName.trim(),
      paymentType: formData.paymentType,
      orderNumber: finalOrderNumber,
      items: formData.items
        .filter((item) => item.productName.trim() && item.quantity > 0)
        .map((item) => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
        })),
    };

    if (!payload.cashierName || payload.items.length === 0) {
      alert("Nama kasir dan minimal satu produk harus diisi.");
      return null;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan pesanan");
      }

      setOrderNumber(result.orderNumber ?? payload.orderNumber);
      orderNumberRef.current = result.orderNumber ?? payload.orderNumber;
      return result;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await saveOrder();
      if (!result) return;

      alert("Pesanan berhasil disimpan!");
      setTodayServedCount((prev) => prev + 1);
      // Sinkronkan halaman Keuangan bila sedang terbuka.
      window.dispatchEvent(new CustomEvent("finance-updated"));
      setFormData({
        cashierName: "",
        paymentType: "qris",
        items: [createEmptyItem()],
      });
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Gagal menyimpan pesanan");
    }
  };

  const handlePrintReceipt = async () => {
    try {
      const result = await saveOrder(
        orderNumberRef.current || createOrderNumber(),
      );
      if (!result) return;

      setTodayServedCount((prev) => prev + 1);
      window.dispatchEvent(new CustomEvent("finance-updated"));
      window.print();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan dan mencetak struk",
      );
    }
  };

  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const initialNumber = createOrderNumber();
    orderNumberRef.current = initialNumber;
    setOrderNumber(initialNumber);
  }, []);

  const handleReset = () => {
    setFormData({
      cashierName: "",
      paymentType: "qris",
      items: [createEmptyItem()],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* FORM */}
          <div className="group bg-white w-full rounded-2xl border border-black hard-shadow-static overflow-hidden">
            <div className="relative h-auto p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-semibold text-xl">New Order</h1>
                  <p className="text-md">Fill in the order details below</p>
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-700">
                    <RiUserLine size={14} />
                    {todayServedCount} pelanggan dilayani hari ini
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 bg-red-500 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition print:hidden"
                >
                  <RiRefreshLine size={14} />
                  Reset
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className=" rounded-2xl mt-5 max-w-2xl mx-auto print:hidden"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1.5">
                      Cashier Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      placeholder="Name"
                      value={formData.cashierName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cashierName: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

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
                              products={products}
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
              cashier={formData.cashierName}
              orderNumber={orderNumber}
              paymentType={formData.paymentType}
              items={formData.items}
              onPrint={handlePrintReceipt}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
