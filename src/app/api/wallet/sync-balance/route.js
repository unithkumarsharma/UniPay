import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

async function syncToFirebaseRTDB(userId, balance) {
  if (!userId) return;
  try {
    const rtdbUrl = `https://unipay-3b9c6-default-rtdb.firebaseio.com/wallets/${userId}.json`;
    await fetch(rtdbUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        balance: Number(balance),
        updatedAt: Date.now(),
      }),
    });
  } catch (e) {
    console.warn('Firebase RTDB REST sync notice:', e.message);
  }
}

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

    // 1. Update Supabase DB directly
    const { error } = await supabaseAdmin
      .from('users')
      .update({ wallet_balance: numBal })
      .or(`id.eq.${userId},user_id.eq.${userId}`);

    if (error) {
      console.error('Supabase balance sync error:', error.message);
    }

    // 2. Real-time broadcast to Firebase Realtime Database
    await syncToFirebaseRTDB(userId, numBal);

    return NextResponse.json({ success: true, newBalance: numBal });
  } catch (error) {
    console.error('Balance sync API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
