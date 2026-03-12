export interface NovelFile {
  id: number;
  file_type: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  prompt?: string | null;
  voice_type_id?: string | null;
  created_at?: string;
}

export interface ChapterSummary {
  id: number;
  novel_id: number;
  title: string;
  outline: string;
  introduction: string;
  chapter_index: number;
  word_count: number;
  title_audio_file_id?: number;
  image_file_id?: number;
  video_file_id?: number | null;
  title_audio_file?: NovelFile;
  image_file?: NovelFile;
  video_file?: NovelFile | null;
  ending_type: number;
  has_paragraphs?: boolean;
  created_at?: string;
  updated_at?: string | null;
}

export interface Paragraph {
  id: number;
  chapter_id: number;
  paragraph_index: number;
  content: string;
  image_file_id?: number;
  image_file?: NovelFile;
  video_file_id?: number | null;
  video_file?: NovelFile | null;
  content_audio_file_id?: number;
  content_audio_file?: NovelFile;
  video_large_file_id?: number | null;
  video_large_file?: NovelFile | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface ChapterDetail extends ChapterSummary {
  word_count: number;
  paragraph_count: number;
  paragraph_list: Paragraph[];
}

export interface Novel {
  id: number;
  name: string;
  category_id: number;
  status: string;
  rating: number;
  word_count: number;
  created_at: string;
  updated_at: string | null;
  overall_outline?: string;
  overall_introduction?: string;
  img_style_txt?: string;
  file_id_list?: number[];
  files: NovelFile[];
  chapter_list: ChapterSummary[];
  ending_chapter_list: ChapterSummary[];
  characters?: Character[];
}

export interface Character {
  id: number;
  novel_id: number;
  type: string;
  name: string;
  sex: string;
  age_type: string;
  species: string;
  body_type: string;
  text: string;
  design_img_id?: number;
  design_img?: NovelFile;
  created_at?: string;
  updated_at?: string | null;
}

export type PageType = 
  | 'cover'           // 封面页
  | 'introduction'    // 介绍页
  | 'chapter-title'  // 章节标题页
  | 'paragraph'      // 段落内容页
  | 'ending-choice'  // 结局选择页
  | 'ending-chapter'; // 结局章节页

export interface BookPage {
  type: PageType;
  pageNumber: number;
  imageUrl?: string;
  textContent?: string;
  chapterId?: number;
  chapterIndex?: number;
  paragraphIndex?: number;
  audioUrl?: string;
  endingType?: number;
  endingList?: ChapterSummary[];
}
