import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FundRequest from '@/models/FundRequest';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const query = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;

    const requests = await FundRequest.find(query)
      .populate('userId', 'name userId role phone city')
      .populate('processedBy', 'name userId role')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: requests.length, requests });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, amount, paymentMethod, utrNumber, remarks } = await request.json();

    const numAmount = parseFloat(amount);
    if (!userId || isNaN(numAmount) || numAmount <= 0 || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'User, valid amount, and payment method required' },
        { status: 400 }
      );
    }

    const fundReq = await FundRequest.create({
      userId,
      amount: numAmount,
      paymentMethod,
      utrNumber: utrNumber || '',
      remarks: remarks || '',
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Fund request submitted successfully',
      request: fundReq,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
