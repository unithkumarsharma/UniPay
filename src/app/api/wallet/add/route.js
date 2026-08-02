import { NextResponse } from 'next/server';
import { processWalletTransaction } from '@/lib/supabaseDB';

export async function POST(request) {
  try {
    const { userId, amount, action, description, performedBy } = await request.json();

    const numAmount = parseFloat(amount);
    if (!userId || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid userId and amount are required' },
        { status: 400 }
      );
    }

    const type = action === 'deduct' ? 'debit' : 'credit';

    const result = await processWalletTransaction({
      userId,
      type,
      amount: numAmount,
      description: description || (type === 'credit' ? 'Fund Added by Admin' : 'Fund Deducted by Admin'),
      performedBy: performedBy || null,
    });

    return NextResponse.json({
      success: true,
      message: `Wallet ${type === 'credit' ? 'credited' : 'debited'} successfully in Supabase`,
      newBalance: result.newBalance,
      log: result.log,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
