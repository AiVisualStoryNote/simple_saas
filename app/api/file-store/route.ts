import { NextRequest, NextResponse } from 'next/server';
import { getFile } from '@/lib/file-store';

export async function POST(request: NextRequest) {
  try {
    const { file_key } = await request.json();

    if (!file_key) {
      return NextResponse.json(
        { success: false, error: 'Missing file_key' },
        { status: 400 }
      );
    }

    const fileInfo = await getFile(file_key);

    if (!fileInfo) {
      return NextResponse.json(
        { success: false, error: 'Failed to get file info' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: fileInfo
    });
  } catch (error) {
    console.error('File store API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}