import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Complaint from '@/models/Complaint';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const query = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;

    const complaints = await Complaint.find(query)
      .populate('userId', 'name userId role phone')
      .populate('resolvedBy', 'name userId role')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, txnId, type, message, priority } = await request.json();

    if (!userId || !type || !message) {
      return NextResponse.json(
        { success: false, error: 'User ID, issue type, and message are required' },
        { status: 400 }
      );
    }

    const complaint = await Complaint.create({
      userId,
      txnId: txnId || '',
      type,
      message,
      priority: priority || 'medium',
      status: 'open',
    });

    return NextResponse.json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await dbConnect();
    const { id, status, resolution, resolvedBy } = await request.json();

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      {
        status,
        resolution: resolution || 'Resolved by support',
        resolvedBy: resolvedBy || null,
      },
      { new: true }
    );

    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Complaint status updated',
      complaint,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
