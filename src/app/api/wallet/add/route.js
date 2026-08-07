import { NextResponse } from 'next/server';
import { executeWalletOperation } from '@/lib/walletStore';

const UUID_MAP = {
  'md001_fallback': '133d4683-ad2b-40ca-822c-2483d3eeadcb',
  'MD001': '133d4683-ad2b-40ca-822c-2483d3eeadcb',
  'dst001_fallback': '40832945-bc1c-44dd-b2ea-79098b5c2214',
  'DST001': '40832945-bc1c-44dd-b2ea-79098b5c2214',
  'rtl001_fallback': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',
  'RTL001': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',
  'rtl002_fallback': '3263eec7-ee31-436b-b08e-1ef111169164',
  'RTL002': '3263eec7-ee31-436b-b08e-1ef111169164',
  'acc001_fallback': 'b8acbfca-565b-4420-b62d-491cda173eec',
  'ACC001': 'b8acbfca-565b-4420-b62d-491cda173eec',
  'adm001_fallback': '3d790ac7-850b-4377-b540-83dc9ce29829',
  'ADM001': '3d790ac7-850b-4377-b540-83dc9ce29829',
};

export async function POST(request) {
  try {
    const { userId: rawUserId, amount, action, description, performedBy: rawPerformedBy } = await request.json();

    const numAmount = parseFloat(amount);
    if (!rawUserId || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid userId and amount are required' },
        { status: 400 }
      );
    }

    const userId = UUID_MAP[rawUserId] || rawUserId;
    const performedBy = UUID_MAP[rawPerformedBy] || rawPerformedBy;
    const type = action === 'deduct' ? 'debit' : 'credit';

    const result = await executeWalletOperation({
      userId,
      type,
      amount: numAmount,
      description: description || (type === 'credit' ? 'Fund Added by Admin' : 'Fund Deducted by Admin'),
      performedBy: performedBy || null,
    });

    return NextResponse.json({
      success: true,
      message: `Wallet ${type === 'credit' ? 'credited' : 'debited'} successfully`,
      newBalance: result.newBalance,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Operation failed' }, { status: 400 });
  }
}
