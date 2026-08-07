import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { executeWalletOperation, executeDirectTransfer, getMemoryStore } from '@/lib/walletStore';
import { createFundRequestDualDB, fetchFundRequestsDualDB, syncBalanceDualDB } from '@/lib/dualDatabase';

const UUID_MAP = {
  // Master Distributor
  'md001_fallback': '133d4683-ad2b-40ca-822c-2483d3eeadcb',
  'MD001': '133d4683-ad2b-40ca-822c-2483d3eeadcb',
  'ajay@unipay.com': '133d4683-ad2b-40ca-822c-2483d3eeadcb',
  'master_distributor': '133d4683-ad2b-40ca-822c-2483d3eeadcb',

  // Distributor
  'dst001_fallback': '40832945-bc1c-44dd-b2ea-79098b5c2214',
  'DST001': '40832945-bc1c-44dd-b2ea-79098b5c2214',
  'ram@unipay.com': '40832945-bc1c-44dd-b2ea-79098b5c2214',
  'distributor': '40832945-bc1c-44dd-b2ea-79098b5c2214',

  // Retailer
  'rtl001_fallback': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',
  'RTL001': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',
  'rohan@unipay.com': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',
  'retailer': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',

  // Accountant
  'acc001_fallback': 'b8acbfca-565b-4420-b62d-491cda173eec',
  'ACC001': 'b8acbfca-565b-4420-b62d-491cda173eec',
  'accountant@unipay.com': 'b8acbfca-565b-4420-b62d-491cda173eec',
  'accountant': 'b8acbfca-565b-4420-b62d-491cda173eec',

  // Admin
  'adm001_fallback': '3d790ac7-850b-4377-b540-83dc9ce29829',
  'ADM001': '3d790ac7-850b-4377-b540-83dc9ce29829',
  'admin@unipay.com': '3d790ac7-850b-4377-b540-83dc9ce29829',
  'admin': '3d790ac7-850b-4377-b540-83dc9ce29829',
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawUserId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');
    const targetRole = searchParams.get('targetRole');
    const status = searchParams.get('status');

    const userId = UUID_MAP[rawUserId] || rawUserId;

    let formattedRequests = [];

    // 1. Dual-DB Fetch
    const dualReqs = await fetchFundRequestsDualDB({ status });

    if (Array.isArray(dualReqs) && dualReqs.length > 0) {
      // Lookup users for enrichments
      const { data: allUsers } = await supabaseAdmin.from('users').select('id, user_id, name, role');
      const userMap = new Map((allUsers || []).map(u => [u.id, u]));

      formattedRequests = dualReqs.map((r) => {
        const u = userMap.get(r.user_id) || (typeof r.userId === 'object' ? r.userId : null);
        return {
          ...r,
          requestId: r.request_id || r.requestId || r.id,
          user_id: r.user_id,
          userId: u ? { id: u.id, userId: u.user_id, name: u.name, role: u.role } : r.userId,
          user: u?.name || r.user || 'Partner',
          userCode: u?.user_id || r.userCode || 'USR',
          role: u?.role || r.role || 'partner',
          amount: Number(r.amount),
          paymentMethod: r.payment_mode || r.paymentMethod,
          utrNumber: r.reference_no || r.utrNumber,
        };
      });

      // Filter by userId if specified
      if (userId) {
        formattedRequests = formattedRequests.filter(r => r.user_id === userId || r.user_id === rawUserId || r.userId?.id === userId || r.userId?.userId === rawUserId);
      }
    }

    // 2. Memory store fallback
    if (formattedRequests.length === 0) {
      const store = getMemoryStore();
      let allReqs = store.fundRequests;

      if (rawUserId || userId) {
        allReqs = allReqs.filter(r => r.user_id === userId || r.user_id === rawUserId || r.userId?.id === userId);
      }
      if (status) {
        allReqs = allReqs.filter(r => r.status === status);
      }
      formattedRequests = allReqs;
    }

    return NextResponse.json({ success: true, count: formattedRequests.length, requests: formattedRequests });
  } catch (error) {
    return NextResponse.json({ success: true, count: 0, requests: getMemoryStore().fundRequests });
  }
}

export async function POST(request) {
  try {
    const { userId: rawUserId, userRole, amount, paymentMethod, utrNumber, bankName, remarks, receiptUrl } = await request.json();

    const numAmount = parseFloat(amount);
    if (!rawUserId || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'User ID, valid amount, and payment method required' },
        { status: 400 }
      );
    }

    // Resolve userId string to exact Supabase UUID using UUID_MAP or DB query
    let actualUuid = UUID_MAP[rawUserId] || rawUserId;
    let actualRole = userRole || 'retailer';

    try {
      const { data: matchedUser } = await supabaseAdmin
        .from('users')
        .select('id, user_id, role, name')
        .or(`id.eq.${actualUuid},user_id.eq.${rawUserId},email.eq.${rawUserId}`)
        .maybeSingle();

      if (matchedUser) {
        actualUuid = matchedUser.id;
        actualRole = matchedUser.role;
      }
    } catch (e) {}

    const role = actualRole.toLowerCase();
    const payMode = (paymentMethod || 'UPI').toUpperCase().replace(/[_ ]/g, '');
    const isCash = payMode === 'CASH';

    // Route target approver based on Online vs Cash Top-Up rules
    let targetRole = 'accountant';
    let targetName = 'Accountant Desk';

    if (isCash) {
      if (role === 'retailer') {
        targetRole = 'distributor';
        targetName = 'Distributor';
      } else if (role === 'distributor') {
        targetRole = 'master_distributor';
        targetName = 'Master Distributor';
      } else {
        targetRole = 'accountant';
        targetName = 'Accountant / Admin';
      }
    } else {
      // ALL Online Top-Ups go directly to Accountant
      targetRole = 'accountant';
      targetName = 'Accountant Desk';
    }

    const requestId = `REQ${Date.now().toString().slice(-6)}`;
    const refNo = utrNumber || `UTR${Date.now()}`;

    const newReq = {
      id: requestId,
      request_id: requestId,
      user_id: actualUuid,
      requester_role: role,
      target_approver_role: targetRole,
      target_approver_name: targetName,
      amount: numAmount,
      payment_mode: payMode,
      paymentMethod: payMode,
      reference_no: refNo,
      utrNumber: refNo,
      bank_name: bankName || 'Company HDFC Escrow',
      remarks: remarks || `${isCash ? 'Cash Top-Up' : 'Online Company Bank Deposit'} Request`,
      receipt_url: receiptUrl || null,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // 1. Always keep memory store updated
    getMemoryStore().fundRequests.unshift(newReq);

    // 2. Dual-Database Write (Supabase + Firebase RTDB)
    const dualRes = await createFundRequestDualDB(newReq);

    return NextResponse.json({
      success: true,
      message: `Fund request #${requestId} submitted to ${targetName} (${isCash ? 'Cash Top-Up' : 'Company Bank Online'}) successfully`,
      request: newReq,
      supabaseSaved: dualRes.supabaseSuccess,
      firebaseSaved: dualRes.firebaseSuccess,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Submission failed' }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    const { requestId, status, adminId: rawAdminId, remarks, rejectionReason } = await request.json();

    if (!requestId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Request ID and valid status (approved/rejected) required' },
        { status: 400 }
      );
    }

    const adminId = UUID_MAP[rawAdminId] || rawAdminId;

    let fundReq = null;

    // 1. Dual DB lookup
    const dualReqs = await fetchFundRequestsDualDB({});
    fundReq = dualReqs.find(r => r.id === requestId || r.request_id === requestId);

    const store = getMemoryStore();
    const memReq = store.fundRequests.find(r => r.id === requestId || r.request_id === requestId);
    if (!fundReq && memReq) {
      fundReq = memReq;
    }

    if (!fundReq) {
      return NextResponse.json({ success: false, error: 'Fund request not found' }, { status: 404 });
    }

    if (memReq) {
      memReq.status = status;
      if (rejectionReason) memReq.rejection_reason = rejectionReason;
    }

    let walletResult = null;

    // 2. Approval Workflow Rules
    if (status === 'approved') {
      const requesterId = fundReq.user_id || fundReq.userId;
      const isCash = (fundReq.payment_mode || fundReq.paymentMethod || '').toUpperCase() === 'CASH';

      if (isCash && adminId) {
        try {
          walletResult = await executeDirectTransfer({
            senderId: adminId,
            receiverId: requesterId,
            amount: fundReq.amount,
            remarks: `Cash Top-Up Approval (#${fundReq.request_id || fundReq.id})`,
          });
        } catch (transferErr) {
          return NextResponse.json(
            { success: false, error: transferErr.message || 'Approver has insufficient wallet balance for this cash top-up.' },
            { status: 400 }
          );
        }
      } else {
        walletResult = await executeWalletOperation({
          userId: requesterId,
          type: 'credit',
          amount: fundReq.amount,
          description: `Company Bank Top-Up Approved (#${fundReq.request_id || fundReq.id})`,
          referenceId: fundReq.request_id || fundReq.id,
          performedBy: adminId || null,
        });
      }
    }

    // 3. Update Supabase DB
    try {
      await supabaseAdmin
        .from('fund_requests')
        .update({
          status,
          remarks: remarks || fundReq.remarks,
          rejection_reason: rejectionReason || null,
          approved_by: adminId || null,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
        })
        .or(`id.eq.${requestId},request_id.eq.${requestId}`);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `Fund request #${requestId} ${status} successfully`,
      status,
      newBalance: walletResult ? walletResult.newBalance : null,
    });
  } catch (error) {
    console.error('PATCH fund request error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Action failed' }, { status: 500 });
  }
}
