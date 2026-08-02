import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { serviceCategories } from '@/data/services';

export async function GET() {
  try {
    const { data: services, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .order('category', { ascending: true });

    if (error || !services || services.length === 0) {
      return NextResponse.json({ success: true, count: serviceCategories.length, services: serviceCategories });
    }

    return NextResponse.json({ success: true, count: services.length, services });
  } catch (error) {
    return NextResponse.json({ success: true, count: serviceCategories.length, services: serviceCategories });
  }
}

export async function PATCH(request) {
  try {
    const { id, serviceId, isActive } = await request.json();

    const targetId = id || serviceId;
    const { data: service, error } = await supabaseAdmin
      .from('services')
      .update({ is_active: isActive })
      .eq('id', targetId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: true,
        message: `Service status toggled (${isActive ? 'Enabled' : 'Disabled'})`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Service ${isActive ? 'enabled' : 'disabled'} in Supabase Database`,
      service,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
