import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { executeWalletOperation, executeDirectTransfer, getMemoryStore } from '@/lib/walletStore';

async function handleUpdate(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const action = body.action || (body.status === 'approved' ? 'approve' : 'reject');
    const processedBy = body.processedBy || body.adminId;
    const rejectionReason = body.rejectionReason;

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    const nextStatus = action === 'approve' ? 'approved' : 'rejected';
    let fundReq = null;

    // 1. Supabase lookup
    try {
      const { data } = await supabaseAdmin
        .from('fund_requests')
        .select('*')
        .or(`id.eq.${id},request_id.eq.${id}`)
        .single();
      fundReq = data;
    } catch (e) {}

    // 2. Memory store lookup
    const store = getMemoryStore();
    const memReq = store.fundRequests.find(r => r.id === id || r.request_id === id);
    if (!fundReq && memReq) {
      fundReq = memReq;
    }

    if (memReq) {
      memReq.status = nextStatus;
      if (rejectionReason) memReq.rejection_reason = rejectionReason;
    }

    const requesterId = body.userId || fundReq?.user_id || fundReq?.userId || memReq?.user_id;
    const amount = Number(body.amount || fundReq?.amount || memReq?.amount || 0);
    const payMode = (fundReq?.payment_mode || memReq?.payment_mode || body.paymentMethod || '').toUpperCase();
    const isCash = payMode === 'CASH';

    let walletRes = null;

    // 3. Approval Workflow Rules
    if (action === 'approve') {
      if (isCash && processedBy) {
        // Cash Top-Up approval: Debit Upline Approver & Credit Downline Requester
        try {
          walletRes = await executeDirectTransfer({
            senderId: processedBy,
            receiverId: requesterId,
            amount: amount,
            remarks: `Cash Top-Up Approval (#${id})`,
          });
        } catch (transferErr) {
          return NextResponse.json(
            { success: false, error: transferErr.message || 'Approver wallet has insufficient balance for this cash top-up.' },
            { status: 400 }
          );
        }
      } else {
        // Online Bank Top-Up (Company Bank Transfer): Credit Requester Wallet directly
        walletRes = await executeWalletOperation({
          userId: requesterId,
          type: 'credit',
          amount: amount,
          description: `Company Bank Top-Up Approved (#${id})`,
          referenceId: id,
          performedBy: processedBy || null,
        });
      }
    }

    // 4. Update Supabase DB
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
    console.error('Fund request update error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Action failed' }, { status: 500 });
  }
}

export async function PATCH(request, context) {
  return handleUpdate(request, context);
}

export async function PUT(request, context) {
  return handleUpdate(request, context);
}
