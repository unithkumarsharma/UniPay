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

    // 1. Seed Default Users if not existing
    const hashedPassword = await bcrypt.hash('123456', 10);

    const defaultUsers = [
      {
        name: 'Rahul Sharma (Admin)',
        email: 'admin@unipay.in',
        phone: '9876543210',
        password: hashedPassword,
        role: 'admin',
        walletBalance: 5000000,
        city: 'Delhi',
        state: 'Delhi',
      },
      {
        name: 'Priya Gupta (Accountant)',
        email: 'accountant@unipay.in',
        phone: '9876543211',
        password: hashedPassword,
        role: 'accountant',
        walletBalance: 0,
        city: 'Delhi',
        state: 'Delhi',
      },
      {
        name: 'Vikram Singh (MD)',
        email: 'md@unipay.in',
        phone: '9876543212',
        password: hashedPassword,
        role: 'master_distributor',
        walletBalance: 250000,
        city: 'Delhi',
        state: 'Delhi',
      },
      {
        name: 'Ankit Kumar (Distributor)',
        email: 'distributor@unipay.in',
        phone: '9876543213',
        password: hashedPassword,
        role: 'distributor',
        walletBalance: 75000,
        city: 'Noida',
        state: 'UP',
      },
      {
        name: 'Suresh Yadav (Retailer)',
        email: 'retailer@unipay.in',
        phone: '9876543214',
        password: hashedPassword,
        role: 'retailer',
        shopName: 'Suresh Mobile Point',
        walletBalance: 12500,
        city: 'Noida',
        state: 'UP',
      },
    ];

    const createdUsers = [];
    for (const u of defaultUsers) {
      let existing = await User.findOne({ phone: u.phone });
      if (!existing) {
        existing = await User.create(u);
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
