import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('complaints')
      .select(`
        *,
        users!complaints_user_id_fkey(id, user_id, name, role, phone)
      `)
      .order('created_at', { ascending: false });

    if (userId) query = query.eq('user_id', userId);
    if (status) query = query.eq('status', status);

    const { data: complaints, error } = await query;

    if (error) {
      console.warn('Supabase fetch complaints warning (using query fallback):', error.message);
      // Fallback query if foreign key alias differs
      const { data: fallbackData } = await supabaseAdmin
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });
      return NextResponse.json({ success: true, count: fallbackData?.length || 0, complaints: fallbackData || [] });
    }

    return NextResponse.json({ success: true, count: complaints?.length || 0, complaints: complaints || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, txnId, type, message, priority } = await request.json();

    if (!userId || !type || !message) {
      return NextResponse.json(
        { success: false, error: 'User ID, issue type, and message are required' },
        { status: 400 }
      );
    }

    const ticketId = `CMP-${Date.now().toString().slice(-6)}`;

    const { data: complaint, error } = await supabaseAdmin
      .from('complaints')
      .insert([
        {
          ticket_id: ticketId,
          user_id: userId,
          txn_id: txnId || '',
          category: type,
          message,
          priority: priority || 'MEDIUM',
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
      complaint,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status, resolution, resolvedBy } = await request.json();

    const { data: complaint, error } = await supabaseAdmin
      .from('complaints')
      .update({
        status,
        resolution: resolution || 'Resolved by admin support',
        resolved_by: resolvedBy || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Complaint status updated in Supabase Database',
      complaint,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
