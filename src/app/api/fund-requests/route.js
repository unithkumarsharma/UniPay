import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { processWalletTransaction } from '@/lib/supabaseDB';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

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

    if (error) {
      console.error('Fetch fund requests error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const formattedRequests = (requests || []).map((req) => ({
      ...req,
      userId: req.users ? {
        id: req.users.id,
        userId: req.users.user_id,
        name: req.users.name,
        role: req.users.role,
        phone: req.users.phone,
        city: req.users.city,
      } : null,
      amount: Number(req.amount),
      paymentMethod: req.payment_mode,
      utrNumber: req.reference_no,
    }));

    return NextResponse.json({ success: true, count: formattedRequests.length, requests: formattedRequests });
  } catch (error) {
    console.error('GET fund requests error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, amount, paymentMethod, utrNumber, bankName, remarks } = await request.json();

    const numAmount = parseFloat(amount);
    if (!userId || isNaN(numAmount) || numAmount <= 0 || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'User ID, valid amount, and payment method required' },
        { status: 400 }
      );
    }

    const requestId = `REQ${Date.now().toString().slice(-6)}`;
    const refNo = utrNumber || `UTR${Date.now()}`;

    const { data: fundReq, error } = await supabaseAdmin
      .from('fund_requests')
      .insert([
        {
          request_id: requestId,
          user_id: userId,
          amount: numAmount,
          payment_mode: paymentMethod,
          reference_no: refNo,
          bank_name: bankName || 'HDFC Bank',
          remarks: remarks || '',
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Create fund request error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Fund request submitted successfully',
      request: {
        ...fundReq,
        paymentMethod: fundReq.payment_mode,
        utrNumber: fundReq.reference_no,
      },
    });
  } catch (error) {
    console.error('POST fund request error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
