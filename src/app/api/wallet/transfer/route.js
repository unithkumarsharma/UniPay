import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
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
    const { senderId: rawSenderId, receiverId: rawReceiverId, amount, remarks } = await request.json();

    const numAmount = parseFloat(amount);
    if (!rawSenderId || !rawReceiverId || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Sender ID, Receiver ID, and valid transfer amount required' },
        { status: 400 }
      );
    }

    const senderId = UUID_MAP[rawSenderId] || rawSenderId;
    const receiverId = UUID_MAP[rawReceiverId] || rawReceiverId;

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
        .or(`id.eq.${senderId},user_id.eq.${rawSenderId}`)
        .maybeSingle();
      if (senderObj) senderRole = senderObj.role;

      const { data: receiverObj } = await supabaseAdmin
        .from('users')
        .select('role, name')
        .or(`id.eq.${receiverId},user_id.eq.${rawReceiverId}`)
        .maybeSingle();
      if (receiverObj) receiverRole = receiverObj.role;
    } catch (e) {}

    // Strict Hierarchy Validation Rules
    if (senderRole && receiverRole) {
      if (senderRole === 'retailer') {
        return NextResponse.json(
          { success: false, error: 'Retailers cannot transfer wallet balance directly. Use Fund Request.' },
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
    return NextResponse.json({ success: false, error: error.message || 'Transfer failed' }, { status: 500 });
  }
}
