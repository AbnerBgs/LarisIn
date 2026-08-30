-- AlterTable
ALTER TABLE "Kategori" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "Produk" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- CreateTable
CREATE TABLE "Penjualan" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "orderNumber" TEXT NOT NULL,
    "cashierName" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Penjualan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenjualanItem" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "penjualanId" TEXT NOT NULL,
    "produkId" TEXT,
    "productName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PenjualanItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Penjualan_orderNumber_key" ON "Penjualan"("orderNumber");

-- AddForeignKey
ALTER TABLE "PenjualanItem" ADD CONSTRAINT "PenjualanItem_penjualanId_fkey" FOREIGN KEY ("penjualanId") REFERENCES "Penjualan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenjualanItem" ADD CONSTRAINT "PenjualanItem_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE SET NULL ON UPDATE CASCADE;
