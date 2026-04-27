import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { dramaId, episodeId, dramaName, episodeName, price } = await request.json();

    if (!dramaId || !episodeId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userName = user.user_metadata?.name || user.email || 'Unknown';

    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, credits')
      .eq('user_id', user.id)
      .single();

    if (customerError || !customer) {
      return NextResponse.json(
        { error: 'Failed to fetch customer data' },
        { status: 500 }
      );
    }

    const { data: existingPurchase } = await supabase
      .from('drama_purchase')
      .select('id')
      .eq('user_id', user.id)
      .eq('episode_id', episodeId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'Episode already purchased' },
        { status: 400 }
      );
    }

    if (price > 0 && customer.credits < price) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      );
    }

    const { data: insertedPurchase, error: insertError } = await supabase
      .from('drama_purchase')
      .insert({
        user_id: user.id,
        drama_id: dramaId,
        episode_id: episodeId,
        price: price,
        purchased_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Error inserting purchase record:', insertError);
      return NextResponse.json(
        { error: 'Failed to record purchase' },
        { status: 500 }
      );
    }

    const purchaseId = insertedPurchase?.id;
    const creditsAfter = price > 0 ? customer.credits - price : customer.credits;

    if (price > 0) {
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          credits: creditsAfter,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error deducting credits:', updateError);

        await supabase
          .from('drama_purchase')
          .delete()
          .eq('id', purchaseId);

        return NextResponse.json(
          { error: 'Failed to process payment' },
          { status: 500 }
        );
      }
    }

    try {
      const description = `用户id=${user.id}，用户名name=${userName}，购买了《${dramaName}》第${episodeId}集，分集名称=${episodeName}，价格credits=${price}，订单drama_purchase_id=${purchaseId}`;

      await supabase
        .from('credits_history')
        .insert({
          customer_id: customer.id,
          amount: price,
          type: 'subtract',
          description: description,
          metadata: {
            user_id: user.id,
            user_name: userName,
            drama_id: dramaId,
            drama_name: dramaName,
            episode_id: episodeId,
            episode_name: episodeName,
            credits_spent: price,
            drama_purchase_id: purchaseId,
            credits_before: customer.credits,
            credits_after: creditsAfter,
          },
        });
    } catch (historyError) {
      console.warn('Failed to record credits_history (non-blocking):', historyError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Purchase API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}