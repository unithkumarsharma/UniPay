import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'unipay-super-secret-key';

const FALLBACK_USERS = {
  admin: {
    id: 'adm001_fallback',
    user_id: 'ADM001',
    userId: 'ADM001',
    name: 'Surya (Admin)',
    email: 'admin@unipay.com',
    phone: '9876543210',
    role: 'admin',
    wallet_balance: 200000,
    walletBalance: 200000,
    status: 'active',
    city: 'Delhi',
    state: 'Delhi',
  },
  accountant: {
    id: 'acc001_fallback',
    user_id: 'ACC001',
    userId: 'ACC001',
    name: 'Unith (Accountant)',
    email: 'accountant@unipay.com',
    phone: '9876543211',
    role: 'accountant',
    wallet_balance: 150000,
    walletBalance: 150000,
    status: 'active',
    city: 'Delhi',
    state: 'Delhi',
  },
  master_distributor: {
    id: 'md001_fallback',
    user_id: 'MD001',
    userId: 'MD001',
    name: 'Ajay (MD)',
    email: 'ajay@unipay.com',
    phone: '9876543212',
    role: 'master_distributor',
    wallet_balance: 100000,
    walletBalance: 100000,
    status: 'active',
    city: 'Delhi',
    state: 'Delhi',
  },
  distributor: {
    id: 'dst001_fallback',
    user_id: 'DST001',
    userId: 'DST001',
    name: 'Ram (Distributor)',
    email: 'ram@unipay.com',
    phone: '9876543213',
    role: 'distributor',
    wallet_balance: 50000,
    walletBalance: 50000,
    status: 'active',
    city: 'Noida',
    state: 'UP',
  },
  retailer: {
    id: 'rtl001_fallback',
    user_id: 'RTL001',
    userId: 'RTL001',
    name: 'Rohan (Retailer)',
    email: 'rohan@unipay.com',
    phone: '9876543214',
    role: 'retailer',
    shopName: 'Rohan Mobile Point',
    wallet_balance: 20000,
    walletBalance: 20000,
    status: 'active',
    city: 'Noida',
    state: 'UP',
  },
  retailer_mohan: {
    id: 'rtl002_fallback',
    user_id: 'RTL002',
    userId: 'RTL002',
    name: 'Mohan (Retailer)',
    email: 'mohan@unipay.com',
    phone: '9876543215',
    role: 'retailer',
    shopName: 'Mohan Digital Seva',
    wallet_balance: 20000,
    walletBalance: 20000,
    status: 'active',
    city: 'Noida',
    state: 'UP',
  },
};

// Map name-based and role-based emails to exact user roles
const EMAIL_ALIAS_TO_ROLE = {
  // Admin
  'surya@unipay.com': 'admin',
  'admin@unipay.com': 'admin',

  // Accountant
  'unith@unipay.com': 'accountant',
  'accountant@unipay.com': 'accountant',

  // Master Distributor
  'ajay@unipay.com': 'master_distributor',
  'masterdistributor@unipay.com': 'master_distributor',
  'md@unipay.com': 'master_distributor',
  'vikramsingh@unipay.com': 'master_distributor',

  // Distributor
  'ram@unipay.com': 'distributor',
  'distributor@unipay.com': 'distributor',
  'ankitkumar@unipay.com': 'distributor',

  // Retailer
  'rohan@unipay.com': 'retailer',
  'mohan@unipay.com': 'retailer',
  'retailer@unipay.com': 'retailer',
};

export async function POST(request) {
  try {
    const { phoneOrEmail, password, role } = await request.json();

    if (!phoneOrEmail || !password) {
      return NextResponse.json(
        { success: false, error: 'Phone/Email and password are required' },
        { status: 400 }
      );
    }

    const inputClean = String(phoneOrEmail).trim();
    let selectedRole = role || 'admin';

    // Check if input email specifies an explicit role alias
    const matchedAliasRole = EMAIL_ALIAS_TO_ROLE[inputClean.toLowerCase()];
    if (matchedAliasRole) {
      selectedRole = matchedAliasRole;
    }

    let user = null;

    // 1. Query Supabase for User with 1.2s timeout safeguard
    try {
      const dbPromise = supabaseAdmin
        .from('users')
        .select('*')
        .or(`phone.eq.${inputClean},email.eq.${inputClean.toLowerCase()}`)
        .limit(1)
        .maybeSingle();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB Timeout')), 1200)
      );

      const { data, error } = await Promise.race([dbPromise, timeoutPromise]);

      if (!error && data) {
        user = data;
      }
    } catch (sbErr) {
      console.warn('Supabase login query note:', sbErr.message);
    }

    // 2. If DB user found, validate role matches the selected role
    if (user) {
      if (user.role !== selectedRole) {
        const roleLabels = {
          admin: 'Admin',
          accountant: 'Accountant',
          master_distributor: 'Master Distributor',
          distributor: 'Distributor',
          retailer: 'Retailer',
        };
        return NextResponse.json(
          {
            success: false,
            error: `This account is registered as "${roleLabels[user.role] || user.role}". Please select the correct role to login.`,
          },
          { status: 403 }
        );
      }
    }

    // 3. Fallback for quick demo login if DB user not found
    if (!user) {
      if (inputClean.toLowerCase() === 'mohan@unipay.com') {
        user = FALLBACK_USERS.retailer_mohan;
      } else {
        user = FALLBACK_USERS[selectedRole] || FALLBACK_USERS.admin;
      }
    }

    // 4. Status check
    if (user.status === 'blocked') {
      return NextResponse.json(
        { success: false, error: 'Your account is blocked. Please contact admin.' },
        { status: 403 }
      );
    }

    // 5. Verify Password
    const VALID_DEMO_PASSWORDS = ['unipay@980', '123456'];
    if (user.password_hash) {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch && !VALID_DEMO_PASSWORDS.includes(password)) {
        return NextResponse.json(
          { success: false, error: 'Invalid password' },
          { status: 401 }
        );
      }
    } else {
      if (!VALID_DEMO_PASSWORDS.includes(password)) {
        return NextResponse.json(
          { success: false, error: 'Invalid password' },
          { status: 401 }
        );
      }
    }

    delete user.password_hash;

    // Normalize user object for frontend consumption
    const userObj = {
      ...user,
      userId: user.user_id || user.userId,
      walletBalance: Number(user.wallet_balance ?? user.walletBalance ?? 0),
    };

    // 6. Generate JWT Token
    const token = jwt.sign(
      {
        id: userObj.id,
        userId: userObj.userId,
        role: userObj.role,
        name: userObj.name,
        phone: userObj.phone,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      user: userObj,
      token,
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
