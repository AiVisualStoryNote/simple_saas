import { Novel, ChapterDetail, BookPage, ChapterSummary } from "@/types/book";

export function buildBookPages(novel: Novel, chapterDetails: ChapterDetail[]): BookPage[] {
  const pages: BookPage[] = [];
  let pageNumber = 1;

  const coverImage = novel.files?.find(
    (f) => f.file_type === "image" && f.file_name.startsWith("cover_image")
  )?.file_url;

  const introVideo = novel.files?.find(
    (f) => {
      const isVideo = f.file_type === "video" && f.file_name.startsWith("cover_video");
      console.log('[book-utils] Checking intro video:', {
        file_type: f.file_type,
        file_name: f.file_name,
        isVideo
      });
      return isVideo;
    }
  )?.file_url;
  console.log('[book-utils] Found intro video:', introVideo);

  const nameAudio = novel.files?.find(
    (f) => f.file_type === "audio" && f.file_name.startsWith("name_audio")
  )?.file_url;

  const introAudio = novel.files?.find(
    (f) => f.file_type === "audio" && f.file_name.startsWith("intro_audio")
  )?.file_url;

  const chapterList = novel.chapter_list || [];
  const endingChapterList = novel.ending_chapter_list || [];
  const totalChapters = chapterList.length + endingChapterList.length;
  const isShortStory = chapterList.length + endingChapterList.length === 1;

  const chapterMap = new Map<number, ChapterDetail>();
  chapterDetails.forEach((ch) => chapterMap.set(ch.id, ch));

  // Page 1: Cover page (always show) - no video for cover
  pages.push({
    type: "cover",
    pageNumber: pageNumber++,
    imageUrl: coverImage,
    textContent: novel.name,
    audioUrl: nameAudio,
  });

  // Page 2: Introduction page (skip in short story mode)
  if (!isShortStory) {
    pages.push({
      type: "introduction",
      pageNumber: pageNumber++,
      imageUrl: coverImage,
      videoUrl: introVideo,
      textContent: novel.overall_introduction || "",
      audioUrl: introAudio,
    });
  }

  // Process regular chapters
  for (const chapter of chapterList) {
    const detail = chapterMap.get(chapter.id);
    
    if (!detail) continue;

    // Chapter title page (skip in short story mode)
    if (!isShortStory) {
      pages.push({
        type: "chapter-title",
        pageNumber: pageNumber++,
        imageUrl: detail.image_file?.file_url,
        videoUrl: detail.video_file?.file_url,
        textContent: detail.title,
        chapterId: detail.id,
        chapterIndex: detail.chapter_index,
        audioUrl: detail.title_audio_file?.file_url,
      });
    }

    // Paragraph pages (always show)
    for (let i = 0; i < (detail.paragraph_list || []).length; i++) {
      const paragraph = detail.paragraph_list[i];
      pages.push({
        type: "paragraph",
        pageNumber: pageNumber++,
        imageUrl: paragraph.image_file?.file_url,
        videoUrl: paragraph.video_large_file?.file_url,
        textContent: paragraph.content,
        chapterId: detail.id,
        chapterIndex: detail.chapter_index,
        paragraphIndex: i + 1,
        audioUrl: paragraph.content_audio_file?.file_url,
      });
    }
  }

  // Ending choice page (skip in short story mode)
  const endingList = endingChapterList;
  if (!isShortStory && endingList.length > 0) {
    const lastChapter = chapterList[chapterList.length - 1];
    const lastDetail = lastChapter ? chapterMap.get(lastChapter.id) : null;
    const lastParagraph = lastDetail?.paragraph_list?.[lastDetail.paragraph_list.length - 1];
    
    pages.push({
      type: "ending-choice",
      pageNumber: pageNumber++,
      imageUrl: lastParagraph?.image_file?.file_url,
      endingList: endingList,
    });
  }

  // Process ending chapters (skip in short story mode)
  for (const chapter of endingList) {
    const detail = chapterMap.get(chapter.id);

    if (!detail) continue;

    if (!isShortStory) {
      // Ending chapter title page
      pages.push({
        type: "ending-chapter",
        pageNumber: pageNumber++,
        imageUrl: detail.image_file?.file_url,
        videoUrl: detail.video_file?.file_url,
        textContent: detail.title,
        chapterId: detail.id,
        chapterIndex: detail.chapter_index,
        endingType: detail.ending_type,
        audioUrl: detail.title_audio_file?.file_url,
      });
    }

    // Ending paragraph pages
    for (let i = 0; i < (detail.paragraph_list || []).length; i++) {
      const paragraph = detail.paragraph_list[i];
      pages.push({
        type: "paragraph",
        pageNumber: pageNumber++,
        imageUrl: paragraph.image_file?.file_url,
        videoUrl: paragraph.video_large_file?.file_url,
        textContent: paragraph.content,
        chapterId: detail.id,
        chapterIndex: detail.chapter_index,
        paragraphIndex: i + 1,
        endingType: detail.ending_type,
        audioUrl: paragraph.content_audio_file?.file_url,
      });
    }
  }

  return pages.map(page => ({ ...page, isShortStory }));
}

export function getEndingTypeLabel(endingType: number): string {
  switch (endingType) {
    case 1:
      return "Open Ending";
    case 2:
      return "Happy Ending";
    case 3:
      return "Tragic Ending";
    default:
      return "Ending";
  }
}
