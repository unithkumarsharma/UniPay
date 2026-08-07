import { NextResponse } from 'next/server';
import { syncBalanceDualDB } from '@/lib/dualDatabase';

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

    // Dual-Database Sync (Supabase + Firebase RTDB Failover)
    const result = await syncBalanceDualDB(userId, numBal);

    return NextResponse.json({
      success: true,
      newBalance: numBal,
      supabaseSynced: result.supabaseSuccess,
      firebaseSynced: result.firebaseSuccess,
    });
  } catch (error) {
    console.error('Balance sync API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
