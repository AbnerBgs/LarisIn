'use client'

import PleaseSelect from '@/components/ui/please-select';
import { RiArrowDownSLine, RiCamera2Line, RiCloseCircleLine } from '@remixicon/react';
import { Scanner, useDevices } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

interface ProductData {
  product: {
    product_name?: string;
    brands?: string;
    ingredients_text?: string;
    nutriments?: {
      energy?: number;
      proteins?: number;
      carbohydrates?: number;
      fat?: number;
      [key: string]: number | undefined;
    };
    image_url?: string;
    packaging?: string;
    quantity?: string;
    categories?: string;
  };
}

function BarcodeScanner() {
  const devices = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Convert devices ke format option
  const cameraOptions = [
    { value: '', label: 'Pilih kamera...' },
    ...devices.map(device => ({
      value: device.deviceId,
      label: device.label || `Kamera ${device.deviceId.slice(0, 8)}`
    }))
  ];

  const handleScan = async (detectedCodes: { rawValue: string; format: string }[]) => {
    if (isScanning || loading) return;
    if (!detectedCodes || detectedCodes.length === 0) return;

    const barcode = detectedCodes[0].rawValue;


    if (!/^\d{13}$/.test(barcode)) {
      setError('Barcode tidak valid. Harus 13 digit EAN.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsScanning(true);
    setLoading(true);
    setProduct(null);
    setError(null);

    try {
      const response = await fetch(`/api/scan/${barcode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengambil data produk');
      }

      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data produk');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
      setIsScanning(false);
    }
  };

  const resetScanner = () => {
    setProduct(null);
    setError(null);
    setLoading(false);
    setIsScanning(false);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Pilihan Kamera */}
      <div className="w-full max-w-md mb-6">
        <label htmlFor="camera-select" className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Kamera
        </label>
        <PleaseSelect
          options={cameraOptions}
          value={selectedDevice}
          onChange={setSelectedDevice}
          placeholder="Pilih kamera..."
        />
      </div>

      {/* Scanner Container */}
      <div className="relative w-full max-w-md">
        <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-gray-200/50">
          {/* Scanner Area dengan Aspect Ratio 3:4 */}
          <div className="aspect-[4/3] relative">
            {!product ? (
              <>
                <Scanner
                  onScan={handleScan}
                  formats={['ean_13']}
                  constraints={{
                    deviceId: selectedDevice,
                    aspectRatio: 4 / 3,
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                  }}
                  sound={true}
                  styles={{
                    container: {
                      width: '100%',
                      height: '100%',
                    },
                    video: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    },
                  }}
                />
                
                {/* Overlay Scanner Guide */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Corner Markers */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/80 rounded-tl-lg"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/80 rounded-tr-lg"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/80 rounded-bl-lg"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/80 rounded-br-lg"></div>
                  
                  {/* Center Line */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-0.5 bg-white/30"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-3/4 bg-white/30"></div>
                </div>

                {/* Info di Atas Scanner */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-white text-xs font-medium flex items-center gap-2">
                    <RiCamera2Line className="h-4 w-4" />
                    Arahkan ke barcode
                  </span>
                </div>

                {/* Loading Indicator */}
                {loading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="text-sm font-medium">Memproses...</span>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm font-medium">
                    {error}
                  </div>
                )}
              </>
            ) : (
              // Product Detail View
              <div className="absolute inset-0 bg-white p-4 overflow-y-auto">
                <button
                  onClick={resetScanner}
                  className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <RiCloseCircleLine className="h-6 w-6 text-gray-500" />
                </button>

                <div className="mt-4">
                  {product.product?.image_url && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={product.product.image_url}
                        alt={product.product?.product_name || 'Product'}
                        className="max-h-48 object-contain rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {product.product?.product_name || 'Produk Tidak Dikenal'}
                  </h2>

                  <div className="space-y-3 text-sm">
                    {product.product?.brands && (
                      <div>
                        <span className="font-medium text-gray-700">Merek:</span>
                        <span className="ml-2 text-gray-900">{product.product.brands}</span>
                      </div>
                    )}

                    {product.product?.quantity && (
                      <div>
                        <span className="font-medium text-gray-700">Kuantitas:</span>
                        <span className="ml-2 text-gray-900">{product.product.quantity}</span>
                      </div>
                    )}

                    {product.product?.categories && (
                      <div>
                        <span className="font-medium text-gray-700">Kategori:</span>
                        <span className="ml-2 text-gray-900">{product.product.categories}</span>
                      </div>
                    )}

                    {product.product?.packaging && (
                      <div>
                        <span className="font-medium text-gray-700">Kemasan:</span>
                        <span className="ml-2 text-gray-900">{product.product.packaging}</span>
                      </div>
                    )}

                    {product.product?.ingredients_text && (
                      <div>
                        <span className="font-medium text-gray-700">Bahan:</span>
                        <p className="mt-1 text-gray-900 leading-relaxed">
                          {product.product.ingredients_text}
                        </p>
                      </div>
                    )}

                    {product.product?.nutriments && (
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-700 mb-2">Informasi Gizi (per 100g)</h3>
                        <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-lg p-3">
                          {product.product.nutriments.energy && (
                            <div className="text-center p-2 bg-white rounded">
                              <div className="text-xs text-gray-500">Energi</div>
                              <div className="font-semibold text-gray-900">
                                {product.product.nutriments.energy} kcal
                              </div>
                            </div>
                          )}
                          {product.product.nutriments.proteins && (
                            <div className="text-center p-2 bg-white rounded">
                              <div className="text-xs text-gray-500">Protein</div>
                              <div className="font-semibold text-gray-900">
                                {product.product.nutriments.proteins}g
                              </div>
                            </div>
                          )}
                          {product.product.nutriments.carbohydrates && (
                            <div className="text-center p-2 bg-white rounded">
                              <div className="text-xs text-gray-500">Karbohidrat</div>
                              <div className="font-semibold text-gray-900">
                                {product.product.nutriments.carbohydrates}g
                              </div>
                            </div>
                          )}
                          {product.product.nutriments.fat && (
                            <div className="text-center p-2 bg-white rounded">
                              <div className="text-xs text-gray-500">Lemak</div>
                              <div className="font-semibold text-gray-900">
                                {product.product.nutriments.fat}g
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={resetScanner}
                    className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg font-medium hard-shadow"
                  >
                    Scan Barcode Lain
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScanBarcodePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <section className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-8 md:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              SCAN BARCODE
            </h1>
            <p className="mt-4 text-sm text-gray-500 max-w-md mx-auto">
              Gunakan kamera untuk memindai barcode produk. Pastikan barcode berada dalam bingkai panduan.
            </p>
          </div>

          {/* Scanner Component */}
          <BarcodeScanner />
        </div>
      </section>
    </div>
  );
}