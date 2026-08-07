import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Service from '@/models/Service';
import CommissionSlab from '@/models/CommissionSlab';
import bcrypt from 'bcryptjs';
import { serviceCategories } from '@/data/services';
import { commissionSlabs } from '@/data/mockData';

export async function POST() {
  try {
    await dbConnect();

    // 1. Seed Default Users if not existing (Supabase & MongoDB)
    const hashedPassword = await bcrypt.hash('unipay@980', 10);

    const defaultUsers = [
      {
        user_id: 'ADM001',
        name: 'Surya (Admin)',
        email: 'admin@unipay.com',
        phone: '9876543210',
        password: hashedPassword,
        password_hash: hashedPassword,
        role: 'admin',
        wallet_balance: 200000,
        walletBalance: 200000,
        city: 'Delhi',
        state: 'Delhi',
        status: 'active',
      },
      {
        user_id: 'ACC001',
        name: 'Unith (Accountant)',
        email: 'accountant@unipay.com',
        phone: '9876543211',
        password: hashedPassword,
        password_hash: hashedPassword,
        role: 'accountant',
        wallet_balance: 150000,
        walletBalance: 150000,
        city: 'Delhi',
        state: 'Delhi',
        status: 'active',
      },
      {
        user_id: 'MD001',
        name: 'Ajay (MD)',
        email: 'ajay@unipay.com',
        phone: '9876543212',
        password: hashedPassword,
        password_hash: hashedPassword,
        role: 'master_distributor',
        wallet_balance: 100000,
        walletBalance: 100000,
        city: 'Delhi',
        state: 'Delhi',
        status: 'active',
      },
      {
        user_id: 'DST001',
        name: 'Ram (Distributor)',
        email: 'ram@unipay.com',
        phone: '9876543213',
        password: hashedPassword,
        password_hash: hashedPassword,
        role: 'distributor',
        wallet_balance: 50000,
        walletBalance: 50000,
        city: 'Noida',
        state: 'UP',
        status: 'active',
      },
      {
        user_id: 'RTL001',
        name: 'Rohan (Retailer)',
        email: 'rohan@unipay.com',
        phone: '9876543214',
        password: hashedPassword,
        password_hash: hashedPassword,
        role: 'retailer',
        shop_name: 'Rohan Mobile Point',
        shopName: 'Rohan Mobile Point',
        wallet_balance: 20000,
        walletBalance: 20000,
        city: 'Noida',
        state: 'UP',
        status: 'active',
      },
      {
        user_id: 'RTL002',
        name: 'Mohan (Retailer)',
        email: 'mohan@unipay.com',
        phone: '9876543215',
        password: hashedPassword,
        password_hash: hashedPassword,
        role: 'retailer',
        shop_name: 'Mohan Digital Seva',
        shopName: 'Mohan Digital Seva',
        wallet_balance: 20000,
        walletBalance: 20000,
        city: 'Noida',
        state: 'UP',
        status: 'active',
      },
    ];

    // Seed Supabase Database
    try {
      const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
      for (const u of defaultUsers) {
        await supabaseAdmin.from('users').upsert(u, { onConflict: 'email' });
      }
    } catch (sbErr) {
      console.warn('Supabase seed notice:', sbErr.message);
    }

    const createdUsers = [];
    for (const u of defaultUsers) {
      let existing = await User.findOne({ phone: u.phone });
      if (!existing) {
        existing = await User.create(u);
      } else {
        existing.walletBalance = u.walletBalance;
        existing.name = u.name;
        await existing.save();
      }
      createdUsers.push(existing);
    }

    // Link parent-child hierarchy
    const admin = createdUsers.find((u) => u.role === 'admin');
    const md = createdUsers.find((u) => u.role === 'master_distributor');
    const dist = createdUsers.find((u) => u.role === 'distributor');
    const rtl = createdUsers.find((u) => u.role === 'retailer');

    if (md && admin && !md.parentId) {
      md.parentId = admin._id;
      await md.save();
    }
    if (dist && md && !dist.parentId) {
      dist.parentId = md._id;
      await dist.save();
    }
    if (rtl && dist && !rtl.parentId) {
      rtl.parentId = dist._id;
      await rtl.save();
    }

    // 2. Seed Services
    for (const cat of serviceCategories) {
      for (const s of cat.services) {
        await Service.updateOne(
          { serviceId: s.id },
          {
            $set: {
              serviceId: s.id,
              name: s.name,
              category: cat.name,
              icon: s.icon,
              isActive: true,
            },
          },
          { upsert: true }
        );
      }
    }

    // 3. Seed Commission Slabs
    for (const slab of commissionSlabs) {
      await CommissionSlab.updateOne(
        { serviceType: slab.service },
        {
          $set: {
            serviceType: slab.service,
            retailerCommission: parseFloat(slab.retailerComm.replace(/[^0-9.]/g, '')) || 1.5,
            distributorMargin: parseFloat(slab.distMargin.replace(/[^0-9.]/g, '')) || 0.5,
            mdMargin: parseFloat(slab.mdMargin.replace(/[^0-9.]/g, '')) || 0.5,
            adminProfit: parseFloat(slab.adminProfit.replace(/[^0-9.]/g, '')) || 0.5,
            isActive: true,
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with default users, hierarchy, services, and commission slabs!',
      usersCount: createdUsers.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
