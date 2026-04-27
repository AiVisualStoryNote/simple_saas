export interface Drama {
  id: number;
  name: string;
  cover_image_key: string;
  resolution: string;
  orientation: string;
  description: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  tags?: DramaTag[];
}

export interface DramaTag {
  id: number;
  name: string;
  color: string;
}

export interface DramaEpisode {
  id: number;
  drama_id: number;
  episode_number: number;
  name: string;
  summary: string;
  outline: string;
  composite_video_key: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface DramaEpisodePrice {
  id: number;
  drama_id: number;
  episode_id: number;
  price: number;
}

export interface DramaEpisodeWithPrice extends DramaEpisode {
  price: number;
  is_purchased: boolean;
  composite_video_key: string | null;
}

export interface DramaDetail extends Drama {
  tags: DramaTag[];
  episodes: DramaEpisodeWithPrice[];
}

export interface DramasResponse {
  dramas: Drama[];
  total: number;
  error?: string;
}

export interface DramaDetailResponse {
  drama: DramaDetail | null;
  error?: string;
}

export interface PurchaseResult {
  success: boolean;
  error?: string;
}

const PAGE_SIZE = 20;

export async function getDramas(params: {
  page?: number;
  keyword?: string;
  orientation?: string;
  tagIds?: number[];
}): Promise<DramasResponse> {
  const { page = 1, keyword = '', orientation = '', tagIds = [] } = params;
  const skip = (page - 1) * PAGE_SIZE;

  const searchParams = new URLSearchParams({
    skip: skip.toString(),
    limit: PAGE_SIZE.toString(),
  });

  if (keyword) {
    searchParams.set('keyword', keyword);
  }

  if (orientation) {
    searchParams.set('orientation', orientation);
  }

  if (tagIds.length > 0) {
    searchParams.set('tag_ids', tagIds.join(','));
  }

  try {
    const response = await fetch(`/api/dramas?${searchParams.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      return { dramas: [], total: 0, error: data.error || 'Failed to fetch dramas' };
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch dramas:', error);
    return { dramas: [], total: 0, error: error instanceof Error ? error.message : 'Failed to fetch dramas' };
  }
}

export async function getDramaDetail(dramaId: number): Promise<DramaDetailResponse> {
  try {
    const response = await fetch(`/api/dramas/${dramaId}`);
    const data = await response.json();

    if (!response.ok) {
      return { drama: null, error: data.error || 'Failed to fetch drama detail' };
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch drama detail:', error);
    return { drama: null, error: error instanceof Error ? error.message : 'Failed to fetch drama detail' };
  }
}

export async function purchaseEpisode(params: {
  dramaId: number;
  episodeId: number;
  dramaName: string;
  episodeName: string;
  price: number;
}): Promise<PurchaseResult> {
  try {
    const response = await fetch('/api/dramas/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to purchase episode' };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to purchase episode:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to purchase episode' };
  }
}

export async function getUserCredits(): Promise<number> {
  try {
    const response = await fetch('/api/credits');
    const data = await response.json();

    if (!response.ok) {
      return 0;
    }

    return data.credits?.remaining_credits ?? 0;
  } catch (error) {
    console.error('Failed to fetch user credits:', error);
    return 0;
  }
}

export async function getFileUrl(fileKey: string): Promise<string | null> {
  try {
    const response = await fetch('/api/file-store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_key: fileKey }),
    });

    const data = await response.json();

    if (data.success && data.data?.file_url) {
      return data.data.file_url;
    }

    return null;
  } catch (error) {
    console.error('Failed to get file URL:', error);
    return null;
  }
}