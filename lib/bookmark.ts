import { createClient } from "@/utils/supabase/client";

export interface UserBookmark {
  id: string;
  user_id: string;
  novel_id: number;
  bookmark_type: number;
  is_anchor: boolean;
  name: string;
  page_number: number;
  created_at: string;
}

export async function getBookmarks(novelId: number): Promise<UserBookmark[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('user_bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .eq('novel_id', novelId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }

  return data || [];
}

export async function getOrCreateDefaultBookmark(novelId: number): Promise<UserBookmark | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data: existing } = await supabase
    .from('user_bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .eq('novel_id', novelId)
    .eq('bookmark_type', 0)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  const { data: newBookmark, error } = await supabase
    .from('user_bookmarks')
    .insert({
      user_id: user.id,
      novel_id: novelId,
      bookmark_type: 0,
      is_anchor: true,
      name: '默认书签',
      page_number: 1,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating default bookmark:', error);
    return null;
  }

  return newBookmark;
}

export async function getAnchorBookmark(novelId: number): Promise<UserBookmark | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .eq('novel_id', novelId)
    .eq('is_anchor', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching anchor bookmark:', error);
    return null;
  }

  return data;
}

export async function createBookmark(
  novelId: number,
  name: string,
  pageNumber: number,
  isAnchor: boolean
): Promise<{ success: boolean; error?: string; bookmark?: UserBookmark }> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data: existingBookmarks, error: fetchError } = await supabase
    .from('user_bookmarks')
    .select('id, bookmark_type')
    .eq('user_id', user.id)
    .eq('novel_id', novelId);

  if (fetchError) {
    console.error('Error fetching existing bookmarks:', fetchError);
    return { success: false, error: 'Failed to fetch bookmarks' };
  }

  if (existingBookmarks && existingBookmarks.length >= 3) {
    return { success: false, error: 'Maximum bookmarks reached (3)' };
  }

  const usedTypes = existingBookmarks?.map(b => b.bookmark_type).filter(t => t !== 0) || [];
  let newBookmarkType = 1;
  if (usedTypes.includes(1)) {
    newBookmarkType = 2;
  } else if (usedTypes.includes(2)) {
    newBookmarkType = 1;
  }

  if (isAnchor) {
    await supabase
      .from('user_bookmarks')
      .update({ is_anchor: false })
      .eq('user_id', user.id)
      .eq('novel_id', novelId)
      .eq('is_anchor', true);
  }

  const { data: newBookmark, error } = await supabase
    .from('user_bookmarks')
    .insert({
      user_id: user.id,
      novel_id: novelId,
      bookmark_type: newBookmarkType,
      is_anchor: isAnchor,
      name: name,
      page_number: pageNumber,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating bookmark:', error);
    return { success: false, error: error.message };
  }

  return { success: true, bookmark: newBookmark };
}

export async function updateBookmarkAnchor(
  bookmarkId: string,
  isAnchor: boolean,
  novelId: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  if (isAnchor) {
    await supabase
      .from('user_bookmarks')
      .update({ is_anchor: false })
      .eq('user_id', user.id)
      .eq('novel_id', novelId)
      .eq('is_anchor', true);
  }

  const { error } = await supabase
    .from('user_bookmarks')
    .update({ is_anchor: isAnchor })
    .eq('id', bookmarkId);

  if (error) {
    console.error('Error updating bookmark anchor:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteBookmark(bookmarkId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('user_bookmarks')
    .delete()
    .eq('id', bookmarkId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting bookmark:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateDefaultBookmarkPage(
  novelId: number,
  pageNumber: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('user_bookmarks')
    .update({ page_number: pageNumber })
    .eq('user_id', user.id)
    .eq('novel_id', novelId)
    .eq('bookmark_type', 0);

  if (error) {
    console.error('Error updating default bookmark page:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
