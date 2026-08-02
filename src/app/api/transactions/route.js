import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import WalletLog from '@/models/WalletLog';
import CommissionSlab from '@/models/CommissionSlab';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const query = {};
    if (userId) query.userId = userId;
    if (type) query.type = type;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .populate('userId', 'name userId role phone shopName')
      .sort({ createdAt: -1 })
      .limit(200);

    return NextResponse.json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, type, amount, serviceDetails } = await request.json();

    const numAmount = parseFloat(amount);
    if (!userId || !type || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'User ID, transaction type, and valid amount are required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (user.walletBalance < numAmount) {
      return NextResponse.json(
        { success: false, error: 'Insufficient wallet balance for this transaction' },
        { status: 400 }
      );
    }

    // Lookup commission slab for this service
    const slab = await CommissionSlab.findOne({
      $or: [{ serviceType: type }, { serviceType: serviceDetails?.serviceName }],
    });

    const retailerComm = slab ? slab.retailerCommission : 1.5;
    const distMargin = slab ? slab.distributorMargin : 0.5;
    const mdMargin = slab ? slab.mdMargin : 0.5;
    const adminProfit = slab ? slab.adminProfit : 0.5;

    // Deduct transaction amount and add retailer commission
    const balanceBefore = user.walletBalance;
    const netDeduction = numAmount - retailerComm;
    const balanceAfter = balanceBefore - netDeduction;

    user.walletBalance = balanceAfter;
    await user.save();

    // Create transaction record
    const txn = await Transaction.create({
      userId: user._id,
      type,
      amount: numAmount,
      commission: retailerComm,
      status: 'success',
      serviceDetails: serviceDetails || {},
      balanceBefore,
      balanceAfter,
      commissionBreakup: {
        retailer: retailerComm,
        distributor: distMargin,
        masterDistributor: mdMargin,
        admin: adminProfit,
      },
    });

    // Create Wallet Log for Retailer
    await WalletLog.create({
      userId: user._id,
      type: 'debit',
      amount: netDeduction,
      balanceBefore,
      balanceAfter,
      description: `${type.toUpperCase()} - ${serviceDetails?.operator || 'Service'} (${serviceDetails?.mobile || ''})`,
      referenceId: txn.txnId,
    });

    // Pay distributor margin if parent exists
    if (user.parentId) {
      const dist = await User.findById(user.parentId);
      if (dist) {
        dist.walletBalance += distMargin;
        await dist.save();
        await WalletLog.create({
          userId: dist._id,
          type: 'credit',
          amount: distMargin,
          balanceBefore: dist.walletBalance - distMargin,
          balanceAfter: dist.walletBalance,
          description: `Commission Margin for ${txn.txnId} from ${user.name}`,
          referenceId: txn.txnId,
        });

        // Pay MD margin if MD exists
        if (dist.parentId) {
          const md = await User.findById(dist.parentId);
          if (md) {
            md.walletBalance += mdMargin;
            await md.save();
            await WalletLog.create({
              userId: md._id,
              type: 'credit',
              amount: mdMargin,
              balanceBefore: md.walletBalance - mdMargin,
              balanceAfter: md.walletBalance,
              description: `Commission Margin for ${txn.txnId} from ${dist.name}`,
              referenceId: txn.txnId,
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction processed successfully!',
      transaction: txn,
      newBalance: balanceAfter,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
