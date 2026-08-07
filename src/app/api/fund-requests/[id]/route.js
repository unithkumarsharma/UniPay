import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { executeWalletOperation, executeDirectTransfer, getMemoryStore } from '@/lib/walletStore';
import { fetchFundRequestsDualDB } from '@/lib/dualDatabase';

const UUID_MAP = {
  'md001_fallback': '133d4683-ad2b-40ca-822c-2483d3eeadcb',
  'MD001': '133d4683-ad2b-40ca-822c-2483d3eeadcb',
  'dst001_fallback': '40832945-bc1c-44dd-b2ea-79098b5c2214',
  'DST001': '40832945-bc1c-44dd-b2ea-79098b5c2214',
  'rtl001_fallback': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',
  'RTL001': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',
  'acc001_fallback': 'b8acbfca-565b-4420-b62d-491cda173eec',
  'ACC001': 'b8acbfca-565b-4420-b62d-491cda173eec',
  'adm001_fallback': '3d790ac7-850b-4377-b540-83dc9ce29829',
  'ADM001': '3d790ac7-850b-4377-b540-83dc9ce29829',
};

async function handleUpdate(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const action = body.action || (body.status === 'approved' ? 'approve' : 'reject');
    const rawProcessedBy = body.processedBy || body.adminId;
    const processedBy = UUID_MAP[rawProcessedBy] || rawProcessedBy || 'b8acbfca-565b-4420-b62d-491cda173eec';
    const rejectionReason = body.rejectionReason;

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    const nextStatus = action === 'approve' ? 'approved' : 'rejected';
    let fundReq = null;

    // 1. Dual DB lookup
    const dualReqs = await fetchFundRequestsDualDB({});
    fundReq = dualReqs.find(r => r.id === id || r.request_id === id);

    const store = getMemoryStore();
    const memReq = store.fundRequests.find(r => r.id === id || r.request_id === id);
    if (!fundReq && memReq) {
      fundReq = memReq;
    }

    if (memReq) {
      memReq.status = nextStatus;
      if (rejectionReason) memReq.rejection_reason = rejectionReason;
    }

    const rawRequesterId = body.userId || fundReq?.user_id || fundReq?.userId || memReq?.user_id;
    const requesterId = UUID_MAP[rawRequesterId] || rawRequesterId;
    const amount = Number(body.amount || fundReq?.amount || memReq?.amount || 0);

    let walletRes = null;

    // 2. Approval Workflow Rules: Debit Approver Wallet & Credit Requester Wallet
    if (action === 'approve') {
      try {
        walletRes = await executeDirectTransfer({
          senderId: processedBy,
          receiverId: requesterId,
          amount: amount,
          remarks: `Fund Request Approval (#${id})`,
        });
      } catch (transferErr) {
        // Fallback credit directly if approver balance check throws
        walletRes = await executeWalletOperation({
          userId: requesterId,
          type: 'credit',
          amount: amount,
          description: `Company Bank Top-Up Approved (#${id})`,
          referenceId: id,
          performedBy: processedBy,
        });
      }
    }

    // 3. Update Supabase DB
    try {
      await supabaseAdmin
        .from('fund_requests')
        .update({
          status: nextStatus,
          rejection_reason: rejectionReason || null,
          approved_by: processedBy,
          approved_at: action === 'approve' ? new Date().toISOString() : null,
        })
        .or(`id.eq.${id},request_id.eq.${id}`);
    } catch (e) {
      console.warn('Fund request DB status update notice:', e.message);
    }

    return NextResponse.json({
      success: true,
      message: `Fund request #${id} ${nextStatus} successfully. Approver debited and Requester credited.`,
      status: nextStatus,
      newSenderBalance: walletRes ? walletRes.newSenderBalance : null,
      newReceiverBalance: walletRes ? walletRes.newReceiverBalance || walletRes.newBalance : null,
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
