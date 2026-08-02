import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedUser) {
      return NextResponse.json({ success: false, error: 'User update failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!['active', 'blocked'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedUser) {
      return NextResponse.json({ success: false, error: 'User update failed' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully in Supabase`,
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully from Supabase',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
