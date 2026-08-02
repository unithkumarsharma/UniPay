import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import WalletLog from '@/models/WalletLog';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const query = {};
    if (userId) query.userId = userId;

    const logs = await WalletLog.find(query)
      .populate('userId', 'name userId role')
      .populate('performedBy', 'name userId role')
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
