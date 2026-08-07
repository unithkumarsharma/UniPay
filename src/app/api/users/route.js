import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import bcrypt from 'bcryptjs';

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

    // Check existing
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User with this mobile number already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password || '123456', 10);
    const userIdTag = `${role}${Date.now().toString().slice(-4)}`;

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
          wallet_balance: parseFloat(initialBalance) || 0,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully in Supabase Database',
      user: newUser,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
