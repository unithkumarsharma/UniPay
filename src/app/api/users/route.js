import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const parentId = searchParams.get('parentId');

    const query = {};
    if (role) query.role = role;
    if (parentId) query.parentId = parentId;

    const users = await User.find(query).populate('parentId', 'name userId role').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, phone, email, password, role, parentId, shopName, city, state, address, initialBalance } = body;

    if (!name || !phone || !role) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and role are required' },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User with this mobile number already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password || '123456', 10);

    const newUser = await User.create({
      name,
      phone,
      email: email || '',
      password: hashedPassword,
      role,
      parentId: parentId || null,
      shopName: shopName || '',
      city: city || '',
      state: state || '',
      address: address || '',
      walletBalance: parseFloat(initialBalance) || 0,
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser.toJSON(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
