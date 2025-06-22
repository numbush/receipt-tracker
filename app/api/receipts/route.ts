import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Receipt from '@/models/Receipt';

// GET /api/receipts - Get all receipts
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const storeName = searchParams.get('storeName');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build filter object
    const filter: any = {};
    
    if (storeName) {
      filter.storeName = { $regex: storeName, $options: 'i' };
    }
    
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const receipts = await Receipt.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Receipt.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: receipts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching receipts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch receipts' },
      { status: 500 }
    );
  }
}

// POST /api/receipts - Create a new receipt
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { imageUrl, imageBase64, storeName, amount, date } = body;

    // Validate required fields
    if (!imageUrl || !storeName || !amount || !date) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: imageUrl, storeName, amount, date' 
        },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Validate date
    const receiptDate = new Date(date);
    if (isNaN(receiptDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Create new receipt
    const receipt = new Receipt({
      imageUrl,
      imageBase64,
      storeName: storeName.trim(),
      amount,
      date: receiptDate,
    });

    const savedReceipt = await receipt.save();

    return NextResponse.json(
      { success: true, data: savedReceipt },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating receipt:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create receipt' },
      { status: 500 }
    );
  }
}
