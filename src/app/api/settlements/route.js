import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const UUID_MAP = {
  'md001_fallback': '133d4683-ad2b-40ca-822c-2483d3eeadcb',
  'MD001': '133d4683-ad2b-40ca-822c-2483d3eeadcb',
  'dst001_fallback': '40832945-bc1c-44dd-b2ea-79098b5c2214',
  'DST001': '40832945-bc1c-44dd-b2ea-79098b5c2214',
  'rtl001_fallback': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',
  'RTL001': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',
  'rtl002_fallback': '3263eec7-ee31-436b-b08e-1ef111169164',
  'RTL002': '3263eec7-ee31-436b-b08e-1ef111169164',
  'acc001_fallback': 'b8acbfca-565b-4420-b62d-491cda173eec',
  'ACC001': 'b8acbfca-565b-4420-b62d-491cda173eec',
  'adm001_fallback': '3d790ac7-850b-4377-b540-83dc9ce29829',
  'ADM001': '3d790ac7-850b-4377-b540-83dc9ce29829',
};

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
    const { userId: rawUserId, userName, userRole, userCode, amount, bankName, accountNo, ifsc } = body;

    const actualUuid = UUID_MAP[rawUserId] || rawUserId;
    const settlementId = `SET-${Date.now().toString().slice(-4)}`;

    const { data: settlement, error } = await supabaseAdmin
      .from('settlements')
      .insert([
        {
          settlement_id: settlementId,
          user_id: actualUuid || null,
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

    let result;
    const { data: byId, error: byIdErr } = await supabaseAdmin
      .from('settlements')
      .update({ status: nextStatus, settled_at: new Date().toISOString() })
      .eq('id', settlementId)
      .select()
      .maybeSingle();

    if (!byIdErr && byId) {
      result = byId;
    } else {
      const { data: bySid, error: bySidErr } = await supabaseAdmin
        .from('settlements')
        .update({ status: nextStatus, settled_at: new Date().toISOString() })
        .eq('settlement_id', settlementId)
        .select()
        .maybeSingle();

      result = bySid;
    }

    return NextResponse.json({ success: true, settlement: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
