import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { executeWalletOperation, executeDirectTransfer, getMemoryStore } from '@/lib/walletStore';

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
    const { userId, userRole, amount, paymentMethod, utrNumber, bankName, remarks, receiptUrl } = await request.json();

    const numAmount = parseFloat(amount);
    if (!userId || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'User ID, valid amount, and payment method required' },
        { status: 400 }
      );
    }

    const role = (userRole || 'retailer').toLowerCase();
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
      // ALL Online Top-Ups (Company Bank Transfer) go directly to Accountant
      targetRole = 'accountant';
      targetName = 'Accountant Desk';
    }

    const requestId = `REQ${Date.now().toString().slice(-6)}`;
    const refNo = utrNumber || `UTR${Date.now()}`;

    const newReq = {
      id: requestId,
      request_id: requestId,
      user_id: userId,
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

    getMemoryStore().fundRequests.unshift(newReq);

    // Try DB Insert
    try {
      await supabaseAdmin.from('fund_requests').insert([{
        request_id: requestId,
        user_id: userId,
        amount: numAmount,
        payment_mode: payMode,
        reference_no: refNo,
        bank_name: bankName || 'Company HDFC Escrow',
        remarks: newReq.remarks,
        receipt_url: receiptUrl || null,
        status: 'pending',
      }]);
    } catch (e) {
      console.warn('DB create fund request notice:', e.message);
    }

    return NextResponse.json({
      success: true,
      message: `Fund request submitted to ${targetName} (${isCash ? 'Cash Top-Up' : 'Company Bank Online'}) successfully`,
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

    let fundReq = null;

    // 1. Supabase lookup
    try {
      const { data } = await supabaseAdmin
        .from('fund_requests')
        .select('*')
        .or(`id.eq.${requestId},request_id.eq.${requestId}`)
        .single();
      fundReq = data;
    } catch (e) {}

    // 2. Memory store lookup
    const store = getMemoryStore();
    const memReq = store.fundRequests.find(r => r.id === requestId || r.request_id === requestId);
    if (!fundReq && memReq) {
      fundReq = memReq;
    }

    if (!fundReq) {
      return NextResponse.json({ success: false, error: 'Fund request not found' }, { status: 404 });
    }

    // Update memory store state
    if (memReq) {
      memReq.status = status;
      if (rejectionReason) memReq.rejection_reason = rejectionReason;
    }

    let walletResult = null;

    // 3. Approval Workflow Rules
    if (status === 'approved') {
      const requesterId = fundReq.user_id || fundReq.userId;
      const isCash = (fundReq.payment_mode || '').toUpperCase() === 'CASH';

      if (isCash && adminId) {
        // Cash Top-Up approval: Deduct from Upline Wallet (adminId/Distributor/MD) & Credit to Downline
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
        // Online Bank Top-Up (Company Bank Transfer): Credit Requester Wallet directly
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

    // 4. Update Supabase DB
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
