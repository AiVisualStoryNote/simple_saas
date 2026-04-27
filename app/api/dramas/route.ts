import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const searchParams = request.nextUrl.searchParams;
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const keyword = searchParams.get('keyword') || '';
    const orientation = searchParams.get('orientation') || '';
    const tagIdsParam = searchParams.get('tag_ids') || '';

    let query = supabase
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
      `, { count: 'exact' })
      .eq('is_deleted', false);

    if (keyword) {
      query = query.ilike('name', `%${keyword}%`);
    }

    if (orientation) {
      query = query.eq('orientation', orientation);
    }

    const { data: dramas, error, count } = await query
      .order('updated_at', { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) {
      console.error('Error fetching dramas:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dramas' },
        { status: 500 }
      );
    }

    let resultDramas = dramas || [];

    if (tagIdsParam) {
      const tagIds = tagIdsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

      if (tagIds.length > 0) {
        const { data: tagRelations, error: tagError } = await supabase
          .from('drama_tag_relation')
          .select('drama_id')
          .eq('is_deleted', false)
          .in('tag_id', tagIds);

        if (tagError) {
          console.error('Error fetching tag relations:', tagError);
        } else {
          const dramaIdsWithTags = new Set(tagRelations?.map(r => r.drama_id) || []);
          resultDramas = resultDramas.filter(d => dramaIdsWithTags.has(d.id));
        }
      }
    }

    const dramaIds = resultDramas.map(d => d.id);

    let tagsMap: Record<number, Array<{ id: number; name: string; color: string }>> = {};

    if (dramaIds.length > 0) {
      const { data: tagRelations } = await supabase
        .from('drama_tag_relation')
        .select(`
          drama_id,
          drama_tag (
            id,
            name,
            color
          )
        `)
        .eq('is_deleted', false)
        .in('drama_id', dramaIds);

      if (tagRelations) {
        tagRelations.forEach(relation => {
          if (relation.drama_tag) {
            if (!tagsMap[relation.drama_id]) {
              tagsMap[relation.drama_id] = [];
            }
            const tag = Array.isArray(relation.drama_tag)
              ? relation.drama_tag[0]
              : relation.drama_tag;
            if (tag && typeof tag === 'object') {
              tagsMap[relation.drama_id].push({
                id: tag.id,
                name: tag.name,
                color: tag.color
              });
            }
          }
        });
      }
    }

    const dramasWithTags = resultDramas.map(drama => ({
      ...drama,
      tags: tagsMap[drama.id] || []
    }));

    return NextResponse.json({
      dramas: dramasWithTags,
      total: count || 0
    });
  } catch (error) {
    console.error('Dramas API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}