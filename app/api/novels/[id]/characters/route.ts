import { NextRequest, NextResponse } from 'next/server';
import { callExternalAPI } from '@/lib/api-novels';

// GET - 获取单个小说的所有角色设计信息
export async function GET(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    // header 'X-Mkt'
    const marketHeader = request.headers.get('X-Mkt');
    const cnMarket = marketHeader === 'cn';

    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    const result = await callExternalAPI('get_novel_characters', { novel_id: parseInt(id, 10) }, cnMarket);

    return NextResponse.json({
      novel: result.novel || result
    });
  } catch (error) {
    console.error('Failed to fetch novel:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch novel' },
      { status: 500 }
    );
  }
}
