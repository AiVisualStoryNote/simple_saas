import { Novel, ChapterDetail, BookPage, ChapterSummary } from "@/types/book";

export function buildBookPages(novel: Novel, chapterDetails: ChapterDetail[]): BookPage[] {
  const pages: BookPage[] = [];
  let pageNumber = 1;

  const coverImage = novel.files?.find(
    (f) => f.file_type === "image" && f.file_name.startsWith("cover_image")
  )?.file_url;

  const nameAudio = novel.files?.find(
    (f) => f.file_type === "audio" && f.file_name.startsWith("name_audio")
  )?.file_url;

  const introAudio = novel.files?.find(
    (f) => f.file_type === "audio" && f.file_name.startsWith("intro_audio")
  )?.file_url;

  // Page 1: Cover page
  pages.push({
    type: "cover",
    pageNumber: pageNumber++,
    imageUrl: coverImage,
    textContent: novel.name,
    audioUrl: nameAudio,
  });

  // Page 2: Introduction page
  pages.push({
    type: "introduction",
    pageNumber: pageNumber++,
    imageUrl: coverImage,
    textContent: novel.overall_introduction || "",
    audioUrl: introAudio,
  });

  // Process regular chapters
  const chapterMap = new Map<number, ChapterDetail>();
  chapterDetails.forEach((ch) => chapterMap.set(ch.id, ch));

  for (const chapter of novel.chapter_list || []) {
    const detail = chapterMap.get(chapter.id);
    
    if (!detail) continue;

    // Chapter title page
    pages.push({
      type: "chapter-title",
      pageNumber: pageNumber++,
      imageUrl: detail.image_file?.file_url,
      textContent: detail.title,
      chapterId: detail.id,
      chapterIndex: detail.chapter_index,
      audioUrl: detail.title_audio_file?.file_url,
    });

    // Paragraph pages
    for (let i = 0; i < (detail.paragraph_list || []).length; i++) {
      const paragraph = detail.paragraph_list[i];
      pages.push({
        type: "paragraph",
        pageNumber: pageNumber++,
        imageUrl: paragraph.image_file?.file_url,
        textContent: paragraph.content,
        chapterId: detail.id,
        chapterIndex: detail.chapter_index,
        paragraphIndex: i + 1,
        audioUrl: paragraph.content_audio_file?.file_url,
      });
    }
  }

  // Ending choice page (if there are ending chapters)
  const endingList = novel.ending_chapter_list || [];
  if (endingList.length > 0) {
    // Get the last paragraph image for the choice page background
    const lastChapter = novel.chapter_list?.[novel.chapter_list.length - 1];
    const lastDetail = lastChapter ? chapterMap.get(lastChapter.id) : null;
    const lastParagraph = lastDetail?.paragraph_list?.[lastDetail.paragraph_list.length - 1];
    
    pages.push({
      type: "ending-choice",
      pageNumber: pageNumber++,
      imageUrl: lastParagraph?.image_file?.file_url,
      endingList: endingList,
    });
  }

  // Process ending chapters
  for (const chapter of endingList) {
    const detail = chapterMap.get(chapter.id);
    
    if (!detail) continue;

    // Ending chapter title page
    pages.push({
      type: "ending-chapter",
      pageNumber: pageNumber++,
      imageUrl: detail.image_file?.file_url,
      textContent: detail.title,
      chapterId: detail.id,
      chapterIndex: detail.chapter_index,
      endingType: detail.ending_type,
      audioUrl: detail.title_audio_file?.file_url,
    });

    // Ending paragraph pages
    for (let i = 0; i < (detail.paragraph_list || []).length; i++) {
      const paragraph = detail.paragraph_list[i];
      pages.push({
        type: "paragraph",
        pageNumber: pageNumber++,
        imageUrl: paragraph.image_file?.file_url,
        textContent: paragraph.content,
        chapterId: detail.id,
        chapterIndex: detail.chapter_index,
        paragraphIndex: i + 1,
        endingType: detail.ending_type,
        audioUrl: paragraph.content_audio_file?.file_url,
      });
    }
  }

  return pages;
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
