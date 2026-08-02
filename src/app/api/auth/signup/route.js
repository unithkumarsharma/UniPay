import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'unipay-super-secret-key';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      password,
      role = 'retailer',
      parentId = null,
      shopName = '',
      city = '',
      state = '',
      address = '',
      bankAccountNo = '',
      bankIfsc = '',
      bankName = '',
      bankAccountHolder = '',
      initialBalance = 0,
    } = body;

    // 1. Validations
    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, phone number, and password are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).trim();
    const cleanEmail = email ? String(email).trim().toLowerCase() : null;

    // 2. Check if user already exists in Supabase
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, phone, email')
      .or(`phone.eq.${cleanPhone}${cleanEmail ? `,email.eq.${cleanEmail}` : ''}`)
      .limit(1)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this mobile number or email already exists.' },
        { status: 400 }
      );
    }

    // 3. Generate Custom User ID Prefix (e.g. RTL001, DST001)
    const prefixes = {
      admin: 'ADM',
      accountant: 'ACC',
      master_distributor: 'MD',
      distributor: 'DST',
      retailer: 'RTL',
    };
    const prefix = prefixes[role] || 'USR';
    
    // Count existing users with this role to generate numeric sequence
    const { count } = await supabaseAdmin
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', role);

    const seq = (count || 0) + 1;
    const userIdStr = `${prefix}${String(seq).padStart(3, '0')}`;

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Attempt Firebase Auth UID creation if Firebase is active
    let firebaseUid = null;
    try {
      if (process.env.FIREBASE_PROJECT_ID) {
        const { default: adminAuth } = await import('@/lib/firebaseAdmin');
        if (adminAuth && typeof adminAuth.createUser === 'function') {
          const fbUser = await adminAuth.createUser({
            phoneNumber: cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`,
            email: cleanEmail || undefined,
            displayName: name,
            password: password,
          });
          firebaseUid = fbUser.uid;
        }
      }
    } catch (fbErr) {
      console.warn('Firebase user creation sync note:', fbErr.message);
    }

    // 6. Insert new user into Supabase `users` table
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          user_id: userIdStr,
          name,
          phone: cleanPhone,
          email: cleanEmail,
          password_hash: hashedPassword,
          role,
          parent_id: parentId || null,
          wallet_balance: parseFloat(initialBalance) || 0.00,
          status: 'active',
          shop_name: shopName,
          city,
          state,
          address,
          bank_account_no: bankAccountNo,
          bank_ifsc: bankIfsc,
          bank_name: bankName,
          bank_account_holder: bankAccountHolder,
          firebase_uid: firebaseUid,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase user insert error:', insertError);
      return NextResponse.json(
        { success: false, error: insertError.message || 'Failed to create user record' },
        { status: 500 }
      );
    }

    // Remove password_hash from return payload
    delete newUser.password_hash;

    // 7. Generate JWT Token
    const token = jwt.sign(
      {
        id: newUser.id,
        userId: newUser.user_id,
        role: newUser.role,
        name: newUser.name,
        phone: newUser.phone,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        ...newUser,
        userId: newUser.user_id,
        walletBalance: Number(newUser.wallet_balance || 0),
      },
      token,
    });
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
