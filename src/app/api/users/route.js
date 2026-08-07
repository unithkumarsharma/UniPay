import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { syncBalanceDualDB } from '@/lib/dualDatabase';
import bcrypt from 'bcryptjs';

const ROLE_PREFIX_MAP = {
  master_distributor: 'MD',
  distributor: 'DST',
  retailer: 'RTL',
  accountant: 'ACC',
  admin: 'ADM',
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const parentId = searchParams.get('parentId');

    let query = supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (role) query = query.eq('role', role);
    if (parentId) query = query.eq('parent_id', parentId);

    let { data: users, error } = await query;

    if (parentId && role && (!users || users.length === 0)) {
      const fallbackQuery = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false });
      if (fallbackQuery.data) {
        users = fallbackQuery.data;
      }
    }

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const formatted = (users || []).map(u => ({
      ...u,
      userId: u.user_id || u.userId,
      walletBalance: Number(u.wallet_balance ?? u.walletBalance ?? 0),
    }));

    return NextResponse.json({ success: true, count: formatted.length, users: formatted });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, password, role, parentId, shopName, city, state, address, initialBalance } = body;

    if (!name || !phone || !role) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and role are required' },
        { status: 400 }
      );
    }

    // Check existing phone
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('phone', phone)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User with this mobile number already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password || '123456', 10);
    const prefix = ROLE_PREFIX_MAP[role] || 'USR';
    const userIdTag = `${prefix}${Date.now().toString().slice(-4)}`;
    const startBalance = parseFloat(initialBalance) || 0;

    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          user_id: userIdTag,
          name,
          phone,
          email: email || '',
          password_hash: hashedPassword,
          role,
          parent_id: parentId || null,
          shop_name: shopName || '',
          city: city || '',
          state: state || '',
          address: address || '',
          wallet_balance: startBalance,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Broadcast initial balance to Dual-Database Engine
    await syncBalanceDualDB(newUser.id, startBalance);
    await syncBalanceDualDB(newUser.user_id, startBalance);

    return NextResponse.json({
      success: true,
      message: `${role.toUpperCase().replace('_', ' ')} account ${name} (${userIdTag}) created successfully`,
      user: {
        ...newUser,
        userId: userIdTag,
        walletBalance: startBalance,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
