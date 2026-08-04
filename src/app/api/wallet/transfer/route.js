import { NextResponse } from 'next/server';
import { executeWalletOperation } from '@/lib/walletStore';

export async function POST(request) {
  try {
    const { senderId, receiverId, amount, remarks } = await request.json();

    const numAmount = parseFloat(amount);
    if (!senderId || !receiverId || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Sender ID, Receiver ID, and valid transfer amount required' },
        { status: 400 }
      );
    }

    if (senderId === receiverId) {
      return NextResponse.json(
        { success: false, error: 'Cannot transfer funds to the same account' },
        { status: 400 }
      );
    }

    const transferRef = `TRF${Date.now().toString().slice(-6)}`;

    // 1. Debit Sender Wallet
    const debitRes = await executeWalletOperation({
      userId: senderId,
      type: 'debit',
      amount: numAmount,
      description: `Fund Transfer to ${receiverId} (${transferRef}) - ${remarks || 'Direct Transfer'}`,
      referenceId: transferRef,
      performedBy: senderId,
    });

    // 2. Credit Receiver Wallet
    await executeWalletOperation({
      userId: receiverId,
      type: 'credit',
      amount: numAmount,
      description: `Fund Transfer from ${senderId} (${transferRef}) - ${remarks || 'Direct Transfer'}`,
      referenceId: transferRef,
      performedBy: senderId,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully transferred ₹${numAmount.toLocaleString('en-IN')}`,
      referenceId: transferRef,
      newSenderBalance: debitRes.newBalance,
    });
  } catch (error) {
    console.error('Wallet transfer API error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Transfer failed' }, { status: 400 });
  }
}
