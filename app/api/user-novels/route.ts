import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { callExternalAPI } from '@/lib/api-novels';

export async function GET(request: NextRequest) {
  try {
    // header 'X-Mkt'
    const marketHeader = request.headers.get('X-Mkt');
    const cnMarket = marketHeader === 'cn';
    const searchParams = request.nextUrl.searchParams;
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const categoryId = searchParams.get('category_id');
    const keyword = searchParams.get('keyword') || '';

    console.log('[keyword] = ', keyword);

    const supabase = await createClient();

    // 获取当前登录用户信息
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    
    // 查询 user_books 表（根据当前登录用户id 和 cnMarket 查询）
    const { data: userBooksIdObjList } = await supabase
      .from('user_books')
      .select('novel_id')
      .eq('user_id', user.id)
      .eq('is_cn', cnMarket)
    const bookIds = (userBooksIdObjList?.map((item) => item.novel_id) || []).join(',');

    const params: any = {
      novel_ids: bookIds,
      skip,
      limit,
      name:keyword,
    };

    if (categoryId !== null && categoryId !== undefined) {
      params.category_ids = categoryId;
    }

    const result = await callExternalAPI('get_novels_byids', params, cnMarket);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch novels:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch novels' },
      { status: 500 }
    );
  }
}
