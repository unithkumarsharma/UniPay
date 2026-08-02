import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import jwt from 'jsonwebtoken';

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

    // Query fresh user profile & wallet_balance from Supabase
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      // Fallback return decoded token info if DB user not found
      return NextResponse.json({
        success: true,
        user: {
          id: decoded.id,
          userId: decoded.userId,
          name: decoded.name,
          phone: decoded.phone,
          role: decoded.role,
          walletBalance: 0,
        },
      });
    }

    delete user.password_hash;

    const userObj = {
      ...user,
      userId: user.user_id || user.userId,
      walletBalance: Number(user.wallet_balance || 0),
    };

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
