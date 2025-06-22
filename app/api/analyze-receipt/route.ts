import { NextRequest, NextResponse } from 'next/server';
import { analyzeReceiptImage } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();
    
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    const result = await analyzeReceiptImage(imageBase64);
    
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
