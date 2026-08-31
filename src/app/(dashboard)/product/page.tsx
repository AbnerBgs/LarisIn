import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"; // Sesuaikan path prisma client kamu

export const revalidate = 0; // Memastikan data selalu segar / tidak di-cache

export default async function ProductPage() {
  const { userId } = await auth();

  // 1. Ambil data produk milik user yang sedang login
  const products = userId
    ? await prisma.produk.findMany({
        where: { userId },
        include: { kategori: true },
        orderBy: {
          createdAt: "desc", // Produk terbaru di atas
        },
      })
    : [];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Produk</h1>
        <p className="text-sm text-gray-500">
          {products.length} produk ditemukan
        </p>
      </div>

      {/* Input Cari */}
      <div className="relative">
        <input
          type="text"
          placeholder="Cari nama atau deskripsi produk..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* List Produk */}
      <div className="rounded-2xl border border-black p-2 bg-white space-y-2 hard-shadow">
        {products.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Belum ada produk. Klik tombol <strong>Buat Baru</strong> di sidebar untuk menambah produk.
          </div>
        ) : (
          products.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{item.nama}</h3>
                      {item.kategori && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                        {item.kategori.nama}
                        </span>
                      )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {item.deskripsi || "Tidak ada deskripsi"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-900">
                  Rp {item.harga.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-500">Stok {item.stok}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
