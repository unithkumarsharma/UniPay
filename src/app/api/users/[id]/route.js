import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const user = await User.findById(id).populate('parentId', 'name userId role');
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const updatedUser = await User.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { status } = await request.json();

    if (!['active', 'blocked'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
