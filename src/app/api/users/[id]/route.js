import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const UUID_MAP = {
  'md001_fallback': '133d4683-ad2b-40ca-822c-2483d3eeadcb',
  'MD001': '133d4683-ad2b-40ca-822c-2483d3eeadcb',
  'dst001_fallback': '40832945-bc1c-44dd-b2ea-79098b5c2214',
  'DST001': '40832945-bc1c-44dd-b2ea-79098b5c2214',
  'rtl001_fallback': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',
  'RTL001': '34a7fb3f-caa3-4275-b0b4-db1bd67a8275',
  'rtl002_fallback': '3263eec7-ee31-436b-b08e-1ef111169164',
  'RTL002': '3263eec7-ee31-436b-b08e-1ef111169164',
  'acc001_fallback': 'b8acbfca-565b-4420-b62d-491cda173eec',
  'ACC001': 'b8acbfca-565b-4420-b62d-491cda173eec',
  'adm001_fallback': '3d790ac7-850b-4377-b540-83dc9ce29829',
  'ADM001': '3d790ac7-850b-4377-b540-83dc9ce29829',
};

export async function GET(request, { params }) {
  try {
    const { id: rawId } = await params;
    const actualUuid = UUID_MAP[rawId] || rawId;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .or(`id.eq.${actualUuid},user_id.eq.${rawId}`)
      .maybeSingle();

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
    const { id: rawId } = await params;
    const body = await request.json();
    const actualUuid = UUID_MAP[rawId] || rawId;

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update(body)
      .or(`id.eq.${actualUuid},user_id.eq.${rawId}`)
      .select()
      .maybeSingle();

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
    const { id: rawId } = await params;
    const { status } = await request.json();
    const actualUuid = UUID_MAP[rawId] || rawId;

    if (!['active', 'blocked'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({ status })
      .or(`id.eq.${actualUuid},user_id.eq.${rawId}`)
      .select()
      .maybeSingle();

    if (error || !updatedUser) {
      return NextResponse.json({ success: false, error: 'Status update failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
