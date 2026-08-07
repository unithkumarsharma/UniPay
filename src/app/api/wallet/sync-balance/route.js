import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    const { userId, newBalance } = await request.json();

    if (!userId || newBalance === undefined) {
      return NextResponse.json(
        { success: false, error: 'userId and newBalance required' },
        { status: 400 }
      );
    }

    const numBal = Number(newBalance);

    // Update Supabase DB directly
    const { error } = await supabaseAdmin
      .from('users')
      .update({ wallet_balance: numBal })
      .or(`id.eq.${userId},user_id.eq.${userId}`);

    if (error) {
      console.error('Supabase balance sync error:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, newBalance: numBal });
  } catch (error) {
    console.error('Balance sync API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
