import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { imagePath } = await request.json();

    if (!imagePath) {
      return NextResponse.json({ success: false, error: 'Image path is required' }, { status: 400 });
    }

    const filename = path.basename(imagePath);
    const sourceFile = path.join(process.cwd(), 'public', filename);
    const targetFile = path.join(process.cwd(), 'public', 'logo.png');

    if (!fs.existsSync(sourceFile)) {
      return NextResponse.json({ success: false, error: 'Source logo file not found' }, { status: 404 });
    }

    fs.copyFileSync(sourceFile, targetFile);

    return NextResponse.json({
      success: true,
      message: 'Active logo updated successfully',
      activeLogo: `/logo.png?v=${Date.now()}`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
