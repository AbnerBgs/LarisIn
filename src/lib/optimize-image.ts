// Optimasi gambar di sisi klien (hanya dipanggil dari komponen client):
// File foto produk dikompresi menjadi data URL kecil sebelum dikirim ke API,
// sehingga kolom gambarUrl di database tidak membengkak.

export const MAX_IMAGE_DIMENSION = 512;
export const MAX_ORIGINAL_FILE_BYTES = 5 * 1024 * 1024; // 5 MB sebelum dikompresi

/**
 * Kompres File gambar menjadi data URL persegi (crop tengah, maks. 512px).
 * Mencoba WebP lebih dulu karena ukurannya paling kecil; fallback ke JPEG.
 */
export async function optimizeImage(file: File): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const side = Math.min(img.naturalWidth, img.naturalHeight);
  const size = Math.min(side, MAX_IMAGE_DIMENSION);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak didukung di browser ini.");

  // Crop bagian tengah (cover) lalu gambar ulang ke ukuran kecil.
  const sx = (img.naturalWidth - side) / 2;
  const sy = (img.naturalHeight - side) / 2;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);

  const webp = canvas.toDataURL("image/webp", 0.75);
  if (webp.startsWith("data:image/webp")) return webp;
  return canvas.toDataURL("image/jpeg", 0.72);
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("File yang dipilih bukan gambar yang valid."));
    img.src = src;
  });
}
