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

    // Retrieve roles of sender and receiver from DB
    let senderRole = null;
    let receiverRole = null;

    try {
      const { data: senderObj } = await supabaseAdmin
        .from('users')
        .select('role, name')
        .or(`id.eq.${senderId},user_id.eq.${senderId}`)
        .single();
      if (senderObj) senderRole = senderObj.role;

      const { data: receiverObj } = await supabaseAdmin
        .from('users')
        .select('role, name')
        .or(`id.eq.${receiverId},user_id.eq.${receiverId}`)
        .single();
      if (receiverObj) receiverRole = receiverObj.role;
    } catch (e) {}

    // Strict Hierarchy Validation Rules
    if (senderRole && receiverRole) {
      if (senderRole === 'retailer') {
        return NextResponse.json(
          { success: false, error: 'Retailers cannot transfer wallet balance to other accounts. Use Fund Request for cash deposit.' },
          { status: 400 }
        );
      }
      if (senderRole === receiverRole) {
        const roleLabel = senderRole.replace('_', ' ').toUpperCase();
        return NextResponse.json(
          { success: false, error: `${roleLabel} cannot transfer balance directly to another ${roleLabel}.` },
          { status: 400 }
        );
      }
      if (senderRole === 'distributor' && receiverRole !== 'retailer') {
        return NextResponse.json(
          { success: false, error: 'Distributors can only transfer wallet balance to Retailers.' },
          { status: 400 }
        );
      }
      if (senderRole === 'master_distributor' && receiverRole !== 'distributor') {
        return NextResponse.json(
          { success: false, error: 'Master Distributors can only transfer wallet balance to Distributors.' },
          { status: 400 }
        );
      }
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
