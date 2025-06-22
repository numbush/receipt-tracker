import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Receipt from '@/models/Receipt';
import mongoose from 'mongoose';

// GET /api/receipts/[id] - Get a single receipt by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid receipt ID format' },
        { status: 400 }
      );
    }

    const receipt = await Receipt.findById(id).lean();

    if (!receipt) {
      return NextResponse.json(
        { success: false, error: 'Receipt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    console.error('Error fetching receipt:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch receipt' },
      { status: 500 }
    );
  }
}

// PUT /api/receipts/[id] - Update a receipt by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid receipt ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { imageUrl, imageBase64, storeName, amount, date } = body;

    // Build update object with only provided fields
    const updateData: any = {};
    
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imageBase64 !== undefined) updateData.imageBase64 = imageBase64;
    if (storeName !== undefined) updateData.storeName = storeName.trim();
    if (amount !== undefined) {
      // Validate amount is a positive number
      if (typeof amount !== 'number' || amount < 0) {
        return NextResponse.json(
          { success: false, error: 'Amount must be a positive number' },
          { status: 400 }
        );
      }
      updateData.amount = amount;
    }
    if (date !== undefined) {
      // Validate date
      const receiptDate = new Date(date);
      if (isNaN(receiptDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid date format' },
          { status: 400 }
        );
      }
      updateData.date = receiptDate;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields provided for update' },
        { status: 400 }
      );
    }

    const updatedReceipt = await Receipt.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedReceipt) {
      return NextResponse.json(
        { success: false, error: 'Receipt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedReceipt,
    });
  } catch (error) {
    console.error('Error updating receipt:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update receipt' },
      { status: 500 }
    );
  }
}

// DELETE /api/receipts/[id] - Delete a receipt by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid receipt ID format' },
        { status: 400 }
      );
    }

    const deletedReceipt = await Receipt.findByIdAndDelete(id).lean();

    if (!deletedReceipt) {
      return NextResponse.json(
        { success: false, error: 'Receipt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Receipt deleted successfully',
      data: deletedReceipt,
    });
  } catch (error) {
    console.error('Error deleting receipt:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete receipt' },
      { status: 500 }
    );
  }
}
