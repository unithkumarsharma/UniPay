import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getMemoryStore } from '@/lib/walletStore';

const ROLE_ROUTING = {
  retailer: { targetRole: 'distributor', targetName: 'Distributor' },
  distributor: { targetRole: 'master_distributor', targetName: 'Master Distributor' },
  master_distributor: { targetRole: 'accountant', targetName: 'Accountant' },
  accountant: { targetRole: 'admin', targetName: 'Admin' },
  admin: { targetRole: 'system', targetName: 'System Treasury' },
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');
    const targetRole = searchParams.get('targetRole');
    const status = searchParams.get('status');

    let formattedRequests = [];

    // Try Supabase fetch
    try {
      let query = supabaseAdmin
        .from('fund_requests')
        .select(`
          *,
          users!fund_requests_user_id_fkey(id, user_id, name, role, phone, city)
        `)
        .order('created_at', { ascending: false });

      if (userId) query = query.eq('user_id', userId);
      if (status) query = query.eq('status', status);

      const { data: requests, error } = await query;
      if (!error && Array.isArray(requests) && requests.length > 0) {
        formattedRequests = requests.map((req) => ({
          ...req,
          requestId: req.request_id || req.id,
          userId: req.users ? {
            id: req.users.id,
            userId: req.users.user_id,
            name: req.users.name,
            role: req.users.role,
          } : null,
          amount: Number(req.amount),
          paymentMethod: req.payment_mode,
          utrNumber: req.reference_no,
        }));
      }
    } catch (e) {
      console.warn('DB fetch fund requests notice:', e.message);
    }

    if (formattedRequests.length === 0) {
      const store = getMemoryStore();
      let allReqs = store.fundRequests;

      if (userId) {
        allReqs = allReqs.filter(r => r.user_id === userId || r.userId?.id === userId);
      } else if (targetRole) {
        allReqs = allReqs.filter(r => r.target_approver_role === targetRole || r.targetRole === targetRole);
      } else if (userRole) {
        // Approver Role view
        const approverMap = {
          distributor: 'distributor',
          master_distributor: 'master_distributor',
          accountant: 'accountant',
          admin: 'admin',
        };
        const neededTarget = approverMap[userRole];
        if (neededTarget) {
          allReqs = allReqs.filter(r => r.target_approver_role === neededTarget || r.user_id === userId);
        }
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
    const { userId, userRole, amount, paymentMethod, utrNumber, bankName, remarks } = await request.json();

    const numAmount = parseFloat(amount);
    if (!userId || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'User ID, valid amount, and payment method required' },
        { status: 400 }
      );
    }

    const role = (userRole || 'retailer').toLowerCase();
    const route = ROLE_ROUTING[role] || ROLE_ROUTING.retailer;
    const requestId = `REQ${Date.now().toString().slice(-6)}`;
    const refNo = utrNumber || `UTR${Date.now()}`;

    const newReq = {
      id: requestId,
      request_id: requestId,
      user_id: userId,
      requester_role: role,
      target_approver_role: route.targetRole,
      target_approver_name: route.targetName,
      amount: numAmount,
      payment_mode: (paymentMethod || 'UPI').toUpperCase().replace(/[_ ]/g, ''),
      paymentMethod: (paymentMethod || 'UPI').toUpperCase(),
      reference_no: refNo,
      utrNumber: refNo,
      bank_name: bankName || 'HDFC Bank',
      remarks: remarks || `Fund Request for ${route.targetName}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    getMemoryStore().fundRequests.unshift(newReq);

    // Try DB Insert
    try {
      await supabaseAdmin.from('fund_requests').insert([{
        request_id: requestId,
        user_id: userId,
        amount: numAmount,
        payment_mode: newReq.payment_mode,
        reference_no: refNo,
        bank_name: bankName || 'HDFC Bank',
        remarks: newReq.remarks,
        status: 'pending',
      }]);
    } catch (e) {
      console.warn('DB create fund request notice:', e.message);
    }

    return NextResponse.json({
      success: true,
      message: `Fund request submitted to ${route.targetName} successfully`,
      request: newReq,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Submission failed' }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    const { requestId, status, adminId, remarks, rejectionReason } = await request.json();

    if (!requestId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Request ID and valid status (approved/rejected) required' },
        { status: 400 }
      );
    }

    // 1. Fetch Fund Request
    const { data: fundReq, error: fetchErr } = await supabaseAdmin
      .from('fund_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchErr || !fundReq) {
      return NextResponse.json({ success: false, error: 'Fund request not found' }, { status: 404 });
    }

    if (fundReq.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: `Fund request is already ${fundReq.status}` },
        { status: 400 }
      );
    }

    // 2. If Approved: Credit User Wallet in Supabase and add Ledger Log
    let walletResult = null;
    if (status === 'approved') {
      walletResult = await processWalletTransaction({
        userId: fundReq.user_id,
        type: 'credit',
        amount: fundReq.amount,
        description: `Fund Request Approved (${fundReq.request_id} - ${fundReq.payment_mode})`,
        referenceId: fundReq.request_id,
        performedBy: adminId || null,
      });
    }

    // 3. Update Fund Request Status in Supabase
    const { data: updatedReq, error: updateErr } = await supabaseAdmin
      .from('fund_requests')
      .update({
        status,
        remarks: remarks || fundReq.remarks,
        rejection_reason: rejectionReason || null,
        approved_by: adminId || null,
        approved_at: status === 'approved' ? new Date().toISOString() : null,
      })
      .eq('id', requestId)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Fund request ${status} successfully`,
      request: updatedReq,
      newBalance: walletResult ? walletResult.newBalance : null,
    });
  } catch (error) {
    console.error('PATCH fund request error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
