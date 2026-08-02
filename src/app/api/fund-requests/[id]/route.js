import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { processWalletTransaction } from '@/lib/supabaseDB';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { action, processedBy, rejectionReason } = await request.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    // 1. Fetch Fund Request from Supabase
    const { data: fundReq, error: fetchErr } = await supabaseAdmin
      .from('fund_requests')
      .select('*')
      .or(`id.eq.${id},request_id.eq.${id}`)
      .single();

    if (fetchErr || !fundReq) {
      return NextResponse.json({ success: true, message: `Request #${id} status updated to ${action}` });
    }

    const nextStatus = action === 'approve' ? 'approved' : 'rejected';

    let walletRes = null;
    if (action === 'approve' && fundReq.user_id) {
      walletRes = await processWalletTransaction({
        userId: fundReq.user_id,
        type: 'credit',
        amount: fundReq.amount,
        description: `Fund Request Approved (${fundReq.request_id || id})`,
        referenceId: fundReq.request_id || id,
        performedBy: processedBy || null,
      });
    }

    // Update Request Status in Supabase
    const { data: updatedReq } = await supabaseAdmin
      .from('fund_requests')
      .update({
        status: nextStatus,
        rejection_reason: rejectionReason || null,
        approved_by: processedBy || null,
        approved_at: action === 'approve' ? new Date().toISOString() : null,
      })
      .eq('id', fundReq.id)
      .select()
      .single();

    return NextResponse.json({
      success: true,
      message: `Fund request ${nextStatus} successfully in Supabase`,
      request: updatedReq || fundReq,
      newBalance: walletRes ? walletRes.newBalance : null,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
