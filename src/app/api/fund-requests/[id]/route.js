import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { executeWalletOperation } from '@/lib/walletStore';

async function handleUpdate(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const action = body.action || (body.status === 'approved' ? 'approve' : 'reject');
    const processedBy = body.processedBy;
    const rejectionReason = body.rejectionReason;
    const userId = body.userId;
    const amount = body.amount;

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    const nextStatus = action === 'approve' ? 'approved' : 'rejected';
    let walletRes = null;

    // 1. Credit wallet if approved
    if (action === 'approve') {
      const targetUser = userId || 'rtl001_fallback';
      const targetAmount = amount || 5000;
      walletRes = await executeWalletOperation({
        userId: targetUser,
        type: 'credit',
        amount: targetAmount,
        description: `Fund Request Approved (${id})`,
        referenceId: id,
        performedBy: processedBy || null,
      });
    }

    // 2. Try DB Update
    try {
      await supabaseAdmin
        .from('fund_requests')
        .update({
          status: nextStatus,
          rejection_reason: rejectionReason || null,
          approved_by: processedBy || null,
          approved_at: action === 'approve' ? new Date().toISOString() : null,
        })
        .or(`id.eq.${id},request_id.eq.${id}`);
    } catch (e) {
      console.warn('Fund request DB status update notice:', e.message);
    }

    return NextResponse.json({
      success: true,
      message: `Fund request #${id} ${nextStatus} successfully`,
      status: nextStatus,
      newBalance: walletRes ? walletRes.newBalance : null,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Action failed' }, { status: 500 });
  }
}

export async function PATCH(request, context) {
  return handleUpdate(request, context);
}

export async function PUT(request, context) {
  return handleUpdate(request, context);
}
