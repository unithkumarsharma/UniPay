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
    let decoded = null;

    if (token && token.startsWith('unipay_fallback_jwt_')) {
      // Demo / Fallback Session token handling
      decoded = { isFallback: true };
    } else {
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        // Soft fallback for demo session tokens or non-jwt tokens
        decoded = { isFallback: true };
      }
    }

    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get('userId');
    const queryRole = searchParams.get('role');

    const targetId = decoded?.id || queryUserId;
    const targetEmail = decoded?.email || '';
    const targetRole = decoded?.role || queryRole;

    let userObj = null;

    // 1. Query fresh user profile from Supabase DB first
    if (targetId || targetEmail) {
      try {
        const { data: dbUser } = await supabaseAdmin
          .from('users')
          .select('*')
          .or(`id.eq.${targetId || 'none'},email.eq.${targetEmail || 'none'}`)
          .maybeSingle();

        if (dbUser) {
          delete dbUser.password_hash;
          userObj = {
            ...dbUser,
            userId: dbUser.user_id || dbUser.userId,
            walletBalance: Number(dbUser.wallet_balance || 0),
          };
        }
      } catch (e) {
        console.warn('/api/auth/me DB lookup notice:', e.message);
      }
    }

    // 2. Memory store sync fallback
    if (!userObj) {
      const store = getMemoryStore();
      const memUser = store.users.find(
        u => u.id === targetId || u.userId === targetId || u.email === targetEmail || (targetRole && u.role === targetRole)
      );
      if (memUser) {
        userObj = {
          ...memUser,
          walletBalance: Number(memUser.walletBalance || 0),
        };
      }
    }

    if (!userObj) {
      const defaultBal = targetRole === 'admin' ? 50000 : targetRole === 'master_distributor' ? 10000 : targetRole === 'distributor' ? 5000 : targetRole === 'retailer' ? 2000 : 0;
      userObj = {
        id: targetId || 'user_fallback',
        userId: targetId || 'USR000',
        name: 'UniPay User',
        phone: '9999900000',
        role: targetRole || 'retailer',
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
