-- AlterTable
ALTER TABLE "Kategori" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "Produk" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
