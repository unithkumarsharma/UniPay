import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Service from '@/models/Service';

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({}).sort({ category: 1, name: 1 });
    return NextResponse.json({ success: true, count: services.length, services });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await dbConnect();
    const { id, serviceId, isActive } = await request.json();

    const query = id ? { _id: id } : { serviceId };
    const service = await Service.findOneAndUpdate(query, { isActive }, { new: true });

    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Service ${isActive ? 'enabled' : 'disabled'} successfully`,
      service,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
