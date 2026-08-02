import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { processWalletTransaction } from '@/lib/supabaseDB';

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

    // 1. Fetch Sender and Receiver from Supabase
    const { data: sender, error: senderErr } = await supabaseAdmin
      .from('users')
      .select('id, name, wallet_balance, status')
      .eq('id', senderId)
      .single();

    if (senderErr || !sender) {
      return NextResponse.json({ success: false, error: 'Sender account not found' }, { status: 404 });
    }

    const { data: receiver, error: rcvrErr } = await supabaseAdmin
      .from('users')
      .select('id, name, wallet_balance, status')
      .eq('id', receiverId)
      .single();

    if (rcvrErr || !receiver) {
      return NextResponse.json({ success: false, error: 'Receiver account not found' }, { status: 404 });
    }

    if (sender.status === 'blocked' || receiver.status === 'blocked') {
      return NextResponse.json({ success: false, error: 'One or both user accounts are blocked' }, { status: 403 });
    }

    const senderBalance = Number(sender.wallet_balance || 0);

    if (senderBalance < numAmount) {
      return NextResponse.json(
        { success: false, error: 'Insufficient wallet balance for transfer' },
        { status: 400 }
      );
    }

    const transferRef = `TRF${Date.now().toString().slice(-6)}`;

    // 2. Debit Sender Wallet
    const debitRes = await processWalletTransaction({
      userId: sender.id,
      type: 'debit',
      amount: numAmount,
      description: `Fund Transfer to ${receiver.name} (${transferRef}) - ${remarks || 'Direct Transfer'}`,
      referenceId: transferRef,
      performedBy: sender.id,
    });

    // 3. Credit Receiver Wallet
    await processWalletTransaction({
      userId: receiver.id,
      type: 'credit',
      amount: numAmount,
      description: `Fund Transfer from ${sender.name} (${transferRef}) - ${remarks || 'Direct Transfer'}`,
      referenceId: transferRef,
      performedBy: sender.id,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully transferred ₹${numAmount} to ${receiver.name}`,
      referenceId: transferRef,
      newSenderBalance: debitRes.newBalance,
    });
  } catch (error) {
    console.error('Wallet transfer error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
