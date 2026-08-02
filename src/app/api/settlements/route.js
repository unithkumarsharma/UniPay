import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('settlements')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data: settlements, error } = await query;

    if (error) {
      console.error('Fetch settlements error:', error);
      return NextResponse.json({ success: true, count: 0, settlements: [] });
    }

    return NextResponse.json({
      success: true,
      count: settlements?.length || 0,
      settlements: settlements || [],
    });
  } catch (error) {
    return NextResponse.json({ success: true, count: 0, settlements: [] });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, userName, userRole, userCode, amount, bankName, accountNo, ifsc } = body;

    const settlementId = `SET-${Date.now().toString().slice(-4)}`;

    const { data: settlement, error } = await supabaseAdmin
      .from('settlements')
      .insert([
        {
          settlement_id: settlementId,
          user_id: userId || null,
          user_name: userName || 'Partner',
          user_role: userRole || 'RETAILER',
          user_code: userCode || '',
          amount: parseFloat(amount) || 0,
          bank_name: bankName || '',
          account_no: accountNo || '',
          ifsc: ifsc || '',
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settlement });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { settlementId, status } = await request.json();

    if (!settlementId) {
      return NextResponse.json({ success: false, error: 'Settlement ID required' }, { status: 400 });
    }

    const nextStatus = status || 'settled';

    // Try by id column first, then by settlement_id
    let result;
    const { data: byId, error: byIdErr } = await supabaseAdmin
      .from('settlements')
      .update({ status: nextStatus, settled_at: new Date().toISOString() })
      .eq('id', settlementId)
      .select()
      .single();

    if (!byIdErr && byId) {
      result = byId;
    } else {
      const { data: bySid, error: bySidErr } = await supabaseAdmin
        .from('settlements')
        .update({ status: nextStatus, settled_at: new Date().toISOString() })
        .eq('settlement_id', settlementId)
        .select()
        .single();

      result = bySid;
    }

    return NextResponse.json({
      success: true,
      message: `Settlement ${nextStatus} in Supabase Database`,
      settlement: result,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
