import { NextRequest, NextResponse } from 'next/server';
import { analyzeReceiptImage } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/analyze-receipt called');
    const { imageBase64 } = await request.json();
    console.log('Received imageBase64:', !!imageBase64);

    if (!imageBase64) {
      console.warn('No imageBase64 found in request body');
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    console.log('Calling analyzeReceiptImage...');
    const result = await analyzeReceiptImage(imageBase64);
    console.log('analyzeReceiptImage result:', result);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Receipt analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze receipt'
      },
      { status: 500 }
    );
  }
}

