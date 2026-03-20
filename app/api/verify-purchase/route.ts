import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { novelId, mkt } = body;

    if (!novelId) {
      return NextResponse.json({ error: 'Novel ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', verified: false }, { status: 401 });
    }

    const cnMarket = mkt === 'cn';

    const { data: purchaseRecord, error: purchaseError } = await supabase
      .from('user_books')
      .select('id')
      .eq('user_id', user.id)
      .eq('novel_id', Number(novelId))
      .eq('is_cn', cnMarket)
      .single();

    if (purchaseError || !purchaseRecord) {
      return NextResponse.json({ error: 'Book not purchased', verified: false }, { status: 403 });
    }

    return NextResponse.json({ verified: true, userId: user.id });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
