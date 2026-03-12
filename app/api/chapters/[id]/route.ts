import { NextRequest, NextResponse } from 'next/server';
import { callExternalAPI } from '@/lib/api-novels';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    const result = await callExternalAPI('get_chapter', { chapter_id: parseInt(id, 10) });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch chapter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch chapter' },
      { status: 500 }
    );
  }
}
