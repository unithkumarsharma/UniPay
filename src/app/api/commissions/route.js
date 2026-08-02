import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('serviceType');

    let query = supabaseAdmin.from('commission_slabs').select('*').order('created_at', { ascending: false });

    if (serviceType) {
      query = query.eq('service_type', serviceType);
    }

    const { data: slabs, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const formattedSlabs = (slabs || []).map((slab) => ({
      ...slab,
      serviceType: slab.service_type,
      operator: slab.operator,
      retailerCommission: Number(slab.retailer_comm || 0),
      distributorMargin: Number(slab.distributor_comm || 0),
      mdMargin: Number(slab.master_distributor_comm || 0),
      adminProfit: Number(slab.admin_comm || 0),
    }));

    return NextResponse.json({ success: true, count: formattedSlabs.length, slabs: formattedSlabs });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      serviceType,
      operator,
      minAmount = 0,
      maxAmount = 100000,
      retailerCommission = 1.5,
      distributorMargin = 0.5,
      mdMargin = 0.5,
      adminProfit = 0.5,
      commType = 'percentage',
    } = body;

    if (!serviceType || !operator) {
      return NextResponse.json(
        { success: false, error: 'Service type and operator name required' },
        { status: 400 }
      );
    }

    const { data: slab, error } = await supabaseAdmin
      .from('commission_slabs')
      .insert([
        {
          service_type: serviceType,
          operator,
          min_amount: parseFloat(minAmount) || 0,
          max_amount: parseFloat(maxAmount) || 100000,
          retailer_comm: parseFloat(retailerCommission) || 0,
          distributor_comm: parseFloat(distributorMargin) || 0,
          master_distributor_comm: parseFloat(mdMargin) || 0,
          admin_comm: parseFloat(adminProfit) || 0,
          comm_type: commType,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Commission slab saved successfully',
      slab,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
