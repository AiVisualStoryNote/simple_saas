import { NextRequest, NextResponse } from 'next/server';
import { callExternalAPI } from '@/lib/api-novels';

// GET - 获取小说列表
export async function GET(request: NextRequest) {
  try {
    // 从URL参数中获取查询条件
    const searchParams = request.nextUrl.searchParams;
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const categoryId = searchParams.get('category_id');
    const status = searchParams.get('status');
    const keyword = searchParams.get('keyword') || '';

    // 构建请求参数
    const params: any = {
      skip,
      limit,
      keyword,
    };

    // 如果有category_id，添加到参数中（字符串类型，支持多个分类逗号分隔或空字符串）
    if (categoryId !== null && categoryId !== undefined) {
      params.category_id = categoryId;
    }

    // 如果有status，添加到参数中
    if (status && status !== 'null') {
      params.status = status;
    }

    const result = await callExternalAPI('get_novels', params);
    return NextResponse.json(result);
  } catch (error) {
    console.error('获取小说列表失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取小说列表失败' },
      { status: 500 }
    );
  }
}
