import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FundRequest from '@/models/FundRequest';
import User from '@/models/User';
import WalletLog from '@/models/WalletLog';

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { action, processedBy, rejectionReason } = await request.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    const fundReq = await FundRequest.findById(id);
    if (!fundReq) {
      return NextResponse.json({ success: false, error: 'Fund request not found' }, { status: 404 });
    }

    if (fundReq.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: `Request already ${fundReq.status}` },
        { status: 400 }
      );
    }

    if (action === 'reject') {
      fundReq.status = 'rejected';
      fundReq.rejectionReason = rejectionReason || 'Rejected by approver';
      fundReq.processedBy = processedBy || null;
      fundReq.processedAt = new Date();
      await fundReq.save();

      return NextResponse.json({
        success: true,
        message: 'Fund request rejected',
        request: fundReq,
      });
    }

    // Approve & Credit Wallet
    const user = await User.findById(fundReq.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const balanceBefore = user.walletBalance;
    const balanceAfter = balanceBefore + fundReq.amount;
    user.walletBalance = balanceAfter;
    await user.save();

    // Create Wallet Log
    await WalletLog.create({
      userId: user._id,
      type: 'credit',
      amount: fundReq.amount,
      balanceBefore,
      balanceAfter,
      description: `Fund Request Approved (${fundReq.requestId})`,
      referenceId: fundReq.requestId,
      performedBy: processedBy || null,
    });

    fundReq.status = 'approved';
    fundReq.processedBy = processedBy || null;
    fundReq.processedAt = new Date();
    await fundReq.save();

    return NextResponse.json({
      success: true,
      message: `Fund request approved and ₹${fundReq.amount} credited to ${user.name}`,
      request: fundReq,
      newBalance: balanceAfter,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
