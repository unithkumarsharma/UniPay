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
    const hashedPassword = await bcrypt.hash('unipay@980', 10);

    const defaultUsers = [
      {
        name: 'Surya (Admin)',
        email: 'admin@unipay.com',
        phone: '9876543210',
        password: hashedPassword,
        role: 'admin',
        walletBalance: 200000,
        city: 'Delhi',
        state: 'Delhi',
      },
      {
        name: 'Unith (Accountant)',
        email: 'accountant@unipay.com',
        phone: '9876543211',
        password: hashedPassword,
        role: 'accountant',
        walletBalance: 150000,
        city: 'Delhi',
        state: 'Delhi',
      },
      {
        name: 'Ajay (MD)',
        email: 'ajay@unipay.com',
        phone: '9876543212',
        password: hashedPassword,
        role: 'master_distributor',
        walletBalance: 100000,
        city: 'Delhi',
        state: 'Delhi',
      },
      {
        name: 'Ram (Distributor)',
        email: 'ram@unipay.com',
        phone: '9876543213',
        password: hashedPassword,
        role: 'distributor',
        walletBalance: 50000,
        city: 'Noida',
        state: 'UP',
      },
      {
        name: 'Rohan (Retailer)',
        email: 'rohan@unipay.com',
        phone: '9876543214',
        password: hashedPassword,
        role: 'retailer',
        shopName: 'Rohan Mobile Point',
        walletBalance: 20000,
        city: 'Noida',
        state: 'UP',
      },
      {
        name: 'Mohan (Retailer)',
        email: 'mohan@unipay.com',
        phone: '9876543215',
        password: hashedPassword,
        role: 'retailer',
        shopName: 'Mohan Digital Seva',
        walletBalance: 20000,
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
