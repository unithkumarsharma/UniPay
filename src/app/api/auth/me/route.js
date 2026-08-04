import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import jwt from 'jsonwebtoken';
import { getMemoryStore } from '@/lib/walletStore';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'unipay-super-secret-key';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Missing token.' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token.' },
        { status: 401 }
      );
    }

    let userObj = null;

    // Check memoryStore user first for live real-time state
    const store = getMemoryStore();
    const memUser = store.users.find(u => u.id === decoded.id || u.email === decoded.email || u.role === decoded.role);
    if (memUser) {
      userObj = {
        ...memUser,
        walletBalance: Number(memUser.walletBalance || 0),
      };
    } else {
      // Query fresh user profile from Supabase
      try {
        const { data: dbUser } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', decoded.id)
          .single();

        if (dbUser) {
          delete dbUser.password_hash;
          userObj = {
            ...dbUser,
            userId: dbUser.user_id || dbUser.userId,
            walletBalance: Number(dbUser.wallet_balance || 0),
          };
        }
      } catch (e) {}
    }

    if (!userObj) {
      const defaultBal = decoded.role === 'admin' ? 50000 : decoded.role === 'master_distributor' ? 10000 : decoded.role === 'distributor' ? 5000 : decoded.role === 'retailer' ? 2000 : 0;
      userObj = {
        id: decoded.id,
        userId: decoded.userId,
        name: decoded.name,
        phone: decoded.phone,
        role: decoded.role,
        walletBalance: defaultBal,
      };
    }

    return NextResponse.json({
      success: true,
      user: userObj,
    });
  } catch (error) {
    console.error('/api/auth/me error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
