import { NextResponse } from 'next/server';
import { callExternalAPI } from '@/lib/api-novels';

// GET - 获取所有小说分类
export async function GET() {
  try {
    const result = await callExternalAPI('get_categories_forreader', {});
    return NextResponse.json(result);
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取分类列表失败' },
      { status: 500 }
    );
  }
}
