import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dramaId = parseInt(id, 10);

    if (isNaN(dramaId)) {
      return NextResponse.json(
        { error: 'Invalid drama ID' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const { data: drama, error: dramaError } = await supabase
      .from('drama_main')
      .select(`
        id,
        name,
        cover_image_key,
        resolution,
        orientation,
        description,
        is_deleted,
        created_at,
        updated_at
      `)
      .eq('id', dramaId)
      .eq('is_deleted', false)
      .single();

    if (dramaError || !drama) {
      return NextResponse.json(
        { error: 'Drama not found' },
        { status: 404 }
      );
    }

    const { data: tagRelations } = await supabase
      .from('drama_tag_relation')
      .select(`
        drama_tag (
          id,
          name,
          color
        )
      `)
      .eq('drama_id', dramaId)
      .eq('is_deleted', false);

    const tags = tagRelations?.map(r => r.drama_tag).filter(Boolean) || [];

    const { data: episodes, error: episodesError } = await supabase
      .from('drama_episode')
      .select(`
        id,
        drama_id,
        episode_number,
        name,
        summary,
        outline,
        composite_video_key,
        is_deleted,
        created_at,
        updated_at
      `)
      .eq('drama_id', dramaId)
      .eq('is_deleted', false)
      .order('episode_number', { ascending: true });

    if (episodesError) {
      console.error('Error fetching episodes:', episodesError);
      return NextResponse.json(
        { error: 'Failed to fetch episodes' },
        { status: 500 }
      );
    }

    const episodeIds = episodes?.map(e => e.id) || [];

    let episodePrices: Record<number, number> = {};
    if (episodeIds.length > 0) {
      const { data: prices } = await supabase
        .from('drama_episode_price')
        .select('episode_id, price')
        .eq('is_deleted', false)
        .in('episode_id', episodeIds);

      if (prices) {
        prices.forEach(p => {
          episodePrices[p.episode_id] = p.price;
        });
      }
    }

    let purchasedEpisodeIds: Set<number> = new Set();
    if (userId && episodeIds.length > 0) {
      const { data: purchases } = await supabase
        .from('drama_purchase')
        .select('episode_id')
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .in('episode_id', episodeIds);

      if (purchases) {
        purchasedEpisodeIds = new Set(purchases.map(p => p.episode_id));
      }
    }

    const episodesWithPrice = episodes?.map(episode => {
      const price = episodePrices[episode.id] || 0;
      const isPurchased = purchasedEpisodeIds.has(episode.id);

      let videoKey: string | null = null;
      if (isPurchased || price === 0) {
        videoKey = episode.composite_video_key;
      }

      return {
        ...episode,
        price,
        is_purchased: isPurchased,
        composite_video_key: videoKey
      };
    }) || [];

    return NextResponse.json({
      drama: {
        ...drama,
        tags,
        episodes: episodesWithPrice
      }
    });
  } catch (error) {
    console.error('Drama detail API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}