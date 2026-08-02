import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import WalletLog from '@/models/WalletLog';

export async function POST(request) {
  try {
    await dbConnect();
    const { senderId, receiverId, amount, remarks } = await request.json();

    const numAmount = parseFloat(amount);
    if (!senderId || !receiverId || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Sender, receiver, and valid amount required' },
        { status: 400 }
      );
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return NextResponse.json(
        { success: false, error: 'Sender or receiver user not found' },
        { status: 404 }
      );
    }

    if (sender.walletBalance < numAmount) {
      return NextResponse.json(
        { success: false, error: 'Insufficient wallet balance for transfer' },
        { status: 400 }
      );
    }

    // Process debit from sender
    const senderBefore = sender.walletBalance;
    sender.walletBalance -= numAmount;
    await sender.save();

    await WalletLog.create({
      userId: sender._id,
      type: 'debit',
      amount: numAmount,
      balanceBefore: senderBefore,
      balanceAfter: sender.walletBalance,
      description: `Fund Transfer to ${receiver.name} (${receiver.userId})`,
      performedBy: sender._id,
    });

    // Process credit to receiver
    const receiverBefore = receiver.walletBalance;
    receiver.walletBalance += numAmount;
    await receiver.save();

    await WalletLog.create({
      userId: receiver._id,
      type: 'credit',
      amount: numAmount,
      balanceBefore: receiverBefore,
      balanceAfter: receiver.walletBalance,
      description: `Fund Received from ${sender.name} (${sender.userId})`,
      performedBy: sender._id,
    });

    return NextResponse.json({
      success: true,
      message: `Transferred ₹${numAmount} to ${receiver.name} successfully`,
      senderBalance: sender.walletBalance,
      receiverBalance: receiver.walletBalance,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
