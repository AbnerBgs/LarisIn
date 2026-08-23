export default function Penjualan() {
  return (
    <div className="min-h-screen bg-gray-50 p-7">
      <section className="mx-auto group border border-black hard-shadow-static max-w-7xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-[#E2E8F0] flex justify-between items-center">
          <h3 className="font-bold text-base text-[#0F172A]">
            Recent Transactions
          </h3>
          <button
            id="btnClear"
            className="text-xs text-red-500 hover:underline font-semibold"
          >
            Clear Data
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Tanggal Transaksi</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Payment Method</th>
                <th className="py-4 px-6">Receipt</th>
              </tr>
            </thead>
            <tbody
              id="tableBody"
              className="divide-y divide-[#E2E8F0] text-sm text-[#334155]"
            ></tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
