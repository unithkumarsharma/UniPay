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
    const rawUserId = searchParams.get('userId');
    const status = searchParams.get('status');

    const userId = UUID_MAP[rawUserId] || rawUserId;

    let query = supabaseAdmin
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) query = query.eq('user_id', userId);
    if (status) query = query.eq('status', status);

    const { data: complaints, error } = await query;

    if (error) {
      console.warn('Supabase fetch complaints warning:', error.message);
    }

    const { data: allUsers } = await supabaseAdmin.from('users').select('id, user_id, name, role');
    const userMap = new Map((allUsers || []).map(u => [u.id, u]));

    const formatted = (complaints || []).map(c => {
      const u = userMap.get(c.user_id);
      return {
        ...c,
        id: c.ticket_id || c.id,
        user: u?.name || 'Partner User',
        role: u?.role?.toUpperCase() || 'PARTNER',
        userCode: u?.user_id || 'USR',
        txnId: c.txn_id,
        type: c.category,
        message: c.message,
        priority: c.priority || 'MEDIUM',
        status: c.status || 'open',
        date: c.created_at ? new Date(c.created_at).toLocaleString('en-IN') : 'Just now',
        reply: c.resolution || '',
      };
    });

    return NextResponse.json({ success: true, count: formatted.length, complaints: formatted });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const rawUserId = body.userId || body.user_id;
    const type = body.type || body.issueType || body.category;
    const message = body.message || body.description;
    const txnId = body.txnId || body.transactionId || '';
    const priority = body.priority || 'MEDIUM';

    if (!rawUserId || !type || !message) {
      return NextResponse.json(
        { success: false, error: 'User ID, issue type, and message are required' },
        { status: 400 }
      );
    }

    const actualUuid = UUID_MAP[rawUserId] || rawUserId;
    const ticketId = `CMP-${Date.now().toString().slice(-6)}`;

    const { data: complaint, error } = await supabaseAdmin
      .from('complaints')
      .insert([
        {
          ticket_id: ticketId,
          user_id: actualUuid,
          txn_id: txnId,
          category: type,
          message,
          priority,
          status: 'open',
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Complaint submitted successfully to Supabase Database',
      complaint: {
        ...complaint,
        id: ticketId,
        txnId,
        type,
        message,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, ticket_id, status, reply, resolution, resolvedBy: rawResolvedBy } = await request.json();
    const resolvedBy = UUID_MAP[rawResolvedBy] || rawResolvedBy;

    const { data: complaint, error } = await supabaseAdmin
      .from('complaints')
      .update({
        status,
        resolution: reply || resolution || 'Resolved by support desk',
        resolved_by: resolvedBy || null,
        updated_at: new Date().toISOString(),
      })
      .or(`id.eq.${id || 'none'},ticket_id.eq.${id || ticket_id || 'none'}`)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Complaint #${id} updated to ${status} successfully`,
      complaint,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
