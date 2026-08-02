import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import WalletLog from '@/models/WalletLog';

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, amount, action, description, performedBy } = await request.json();

    const numAmount = parseFloat(amount);
    if (!userId || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid userId and amount are required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const isCredit = action !== 'deduct';
    const balanceBefore = user.walletBalance;

    if (!isCredit && balanceBefore < numAmount) {
      return NextResponse.json(
        { success: false, error: 'Insufficient wallet balance' },
        { status: 400 }
      );
    }

    const balanceAfter = isCredit ? balanceBefore + numAmount : balanceBefore - numAmount;
    user.walletBalance = balanceAfter;
    await user.save();

    // Create log
    const log = await WalletLog.create({
      userId: user._id,
      type: isCredit ? 'credit' : 'debit',
      amount: numAmount,
      balanceBefore,
      balanceAfter,
      description: description || (isCredit ? 'Fund Added by Admin' : 'Fund Deducted by Admin'),
      performedBy: performedBy || null,
    });

    return NextResponse.json({
      success: true,
      message: `Wallet ${isCredit ? 'credited' : 'debited'} successfully`,
      newBalance: balanceAfter,
      log,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
