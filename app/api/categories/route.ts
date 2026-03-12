import { NextResponse } from 'next/server';
import { callExternalAPI } from '@/lib/api-novels';

export async function GET() {
  try {
    const result = await callExternalAPI('get_categories_forreader', {});
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
