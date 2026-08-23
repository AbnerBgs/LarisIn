import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ barcode: string }> }
) {
  try {
    const { barcode } = await params;
    
    // Validasi EAN (13 digit)
    if (!/^\d{13}$/.test(barcode)) {
      return NextResponse.json(
        { error: 'Invalid EAN format. Must be 13 digits.' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://world.openfoodfacts.net/api/v3.6/product/${barcode}.json`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Basic ' + btoa('off:off'),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Cek apakah product ditemukan
    if (data.status === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product data' },
      { status: 500 }
    );
  }
}