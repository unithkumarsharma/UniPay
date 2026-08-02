import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CommissionSlab from '@/models/CommissionSlab';

export async function GET() {
  try {
    await dbConnect();
    const slabs = await CommissionSlab.find({}).sort({ serviceType: 1 });
    return NextResponse.json({ success: true, count: slabs.length, slabs });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { serviceType, retailerCommission, distributorMargin, mdMargin, adminProfit } = await request.json();

    if (!serviceType) {
      return NextResponse.json({ success: false, error: 'Service type required' }, { status: 400 });
    }

    const slab = await CommissionSlab.findOneAndUpdate(
      { serviceType },
      {
        serviceType,
        retailerCommission: parseFloat(retailerCommission) || 0,
        distributorMargin: parseFloat(distributorMargin) || 0,
        mdMargin: parseFloat(mdMargin) || 0,
        adminProfit: parseFloat(adminProfit) || 0,
        isActive: true,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Commission slab saved', slab });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
