import { NextRequest, NextResponse } from 'next/server';
import { callExternalAPI } from '@/lib/api-novels';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const categoryId = searchParams.get('category_id');
    const status = searchParams.get('status');
    const keyword = searchParams.get('keyword') || '';

    const params: any = {
      skip,
      limit,
      keyword,
    };

    if (categoryId !== null && categoryId !== undefined) {
      params.category_id = categoryId;
    }

    if (status && status !== 'null') {
      params.status = status;
    }

    const result = await callExternalAPI('get_novels', params);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch novels:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch novels' },
      { status: 500 }
    );
  }
}
