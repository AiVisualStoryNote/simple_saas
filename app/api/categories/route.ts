import { NextResponse, NextRequest } from 'next/server';
import { callExternalAPI } from '@/lib/api-novels';

export async function GET(request: NextRequest) {
  try {
    // header 'X-Mkt'
    const marketHeader = request.headers.get('X-Mkt');
    const cnMarket = marketHeader === 'cn';
    const result = await callExternalAPI('get_categories_forreader', {}, cnMarket);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
