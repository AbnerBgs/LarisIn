"use client";

interface OrderItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
}

interface OrderReceiptProps {
  cashier: string;
  orderNumber: string;
  paymentType: string;
  items: OrderItem[];
  businessName?: string;
  taxRate?: number;
  onPrint?: () => void;
}

export default function OrderReceipt({
  cashier,
  orderNumber,
  paymentType,
  items,
  businessName = "Nama Usaha",
  taxRate = 0.11,
  onPrint,
}: OrderReceiptProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const validItems = items.filter((i) => i.productName);
  const subtotal = validItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }

    window.print();
  };

  return (
    <>
      <div className="p-5 print:hidden">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          {/* HEADER */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-sm font-bold text-white">
                {businessName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {businessName}
                </p>
                <p className="text-xs text-gray-500">Order Receipt</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400">Order #</p>
              <p className="text-xs font-mono font-semibold text-gray-700">
                {orderNumber}
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300" />

          {/* PREVIEW PRODUCT */}
          <div className="space-y-2 py-3">
            {validItems.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                Belum ada produk dipilih
              </p>
            ) : (
              <>
                <div className="flex justify-between mb-3">
                  <p>Kasir</p>
                  <p>{cashier}</p>
                </div>
                {validItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-800">{item.productName}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="font-mono text-gray-800">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="border-t border-dashed border-gray-300" />

          {/* TOTAL INCLUDE TAX */}
          <div className="space-y-1.5 py-3 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="font-mono">{formatPrice(subtotal)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Pajak ({Math.round(taxRate * 100)}%)</span>
                <span className="font-mono">{formatPrice(tax)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-gray-300" />

          {/* TOTAL */}
          <div className="flex items-center justify-between pt-3">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-mono text-xl font-bold text-black">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* PRINT STRUK */}
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={handlePrint}
            disabled={validItems.length === 0}
            className="group border border-black hard-shadow w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
          >
            Cetak Struk
          </button>
        </div>
      </div>

      {/* STYLE PRINT */}
      <div
        id="receipt"
        className="hidden print:block font-mono text-sm w-[58mm] mx-auto"
      >
        <h2 className="text-center font-bold">{businessName}</h2>
        <p className="text-center text-xs">Order #{orderNumber}</p>
        <div className="border-t border-dashed border-black my-2" />
        {validItems.length > 0 && (
          <div className="flex justify-between text-xs mb-2">
            <span>Kasir</span>
            <span>{cashier}</span>
          </div>
        )}
        {validItems.map((item) => (
          <div key={item.id} className="mb-1">
            <p>{item.productName}</p>
            <div className="flex justify-between text-xs">
              <span>
                {item.quantity} x {formatPrice(item.price)}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          </div>
        ))}
        <div className="border-t border-dashed border-black my-2" />
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {taxRate > 0 && (
            <div className="flex justify-between">
              <span>Pajak ({Math.round(taxRate * 100)}%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
          )}
        </div>
        <div className="border-t border-dashed border-black my-2" />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <p className="mt-2 text-xs">Pembayaran: {paymentType.toUpperCase()}</p>
      </div>
    </>
  );
}
