import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getMemoryStore } from '@/lib/walletStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let logs = [];
    try {
      let query = supabaseAdmin
        .from('wallet_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (userId) query = query.eq('user_id', userId);
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        logs = data;
      }
    } catch (dbErr) {
      console.warn('DB wallet logs fetch notice:', dbErr.message);
    }

    if (logs.length === 0) {
      const store = getMemoryStore();
      logs = userId ? store.logs.filter(l => l.user_id === userId) : store.logs;
    }

    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (error) {
    return NextResponse.json({ success: true, count: 0, logs: getMemoryStore().logs });
  }
}
