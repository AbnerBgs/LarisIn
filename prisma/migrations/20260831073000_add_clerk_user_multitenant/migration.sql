-- =====================================================================
-- Migrasi multi-tenant: semua data kini dimiliki oleh `User` (Clerk).
-- Tabel dibuat/diubah agar sesuai schema.prisma.
-- =====================================================================

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UmkmProfile" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Nama Usaha',
    "category" TEXT,
    "street" TEXT,
    "district" TEXT,
    "city" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "whatsapp" TEXT,
    "openHours" TEXT,
    "jobsText" TEXT,
    "linkInsta" TEXT,
    "linkFb" TEXT,
    "linkWeb" TEXT,
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UmkmProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransaksiKeuangan" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransaksiKeuangan_pkey" PRIMARY KEY ("id")
);

-- DropIndex — uniqueness kini per user
DROP INDEX "Kategori_nama_key";
DROP INDEX "Penjualan_orderNumber_key";

-- AlterTable
ALTER TABLE "Kategori" ADD COLUMN "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Produk" DROP CONSTRAINT "Produk_kategoriId_fkey";
ALTER TABLE "Produk" ADD COLUMN "userId" TEXT NOT NULL;
ALTER TABLE "Produk" ALTER COLUMN "kategoriId" DROP NOT NULL;
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Kategori"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Penjualan" ADD COLUMN "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UmkmProfile_userId_key" ON "UmkmProfile"("userId");
CREATE UNIQUE INDEX "Kategori_userId_nama_key" ON "Kategori"("userId", "nama");
CREATE UNIQUE INDEX "Penjualan_userId_orderNumber_key" ON "Penjualan"("userId", "orderNumber");

-- AddForeignKey
ALTER TABLE "UmkmProfile" ADD CONSTRAINT "UmkmProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Kategori" ADD CONSTRAINT "Kategori_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Penjualan" ADD CONSTRAINT "Penjualan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TransaksiKeuangan" ADD CONSTRAINT "TransaksiKeuangan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
