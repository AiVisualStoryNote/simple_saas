"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingProgress } from "@/components/reading-room/loading-progress";
import { Button } from "@/components/ui/button";

interface NovelFile {
  id: number;
  file_type: string;
  file_url: string;
  file_name: string;
}

interface Novel {
  id: number;
  name: string;
  category_id: number;
  status: string;
  rating: number;
  word_count: number;
  created_at: string;
  updated_at: string;
  files: NovelFile[];
  chapter_list: ChapterSummary[];
  ending_chapter_list: ChapterSummary[];
}

interface ChapterSummary {
  id: number;
  novel_id: number;
  title: string;
  outline: string;
  introduction: string;
  chapter_index: number;
  ending_type: number;
}

interface ChapterDetail {
  id: number;
  novel_id: number;
  title: string;
  outline: string;
  introduction: string;
  chapter_index: number;
  ending_type: number;
  word_count: number;
  title_audio_file: NovelFile;
  image_file: NovelFile;
  paragraph_count: number;
  paragraph_list: Paragraph[];
}

interface Paragraph {
  id: number;
  chapter_id: number;
  paragraph_index: number;
  content: string;
  image_file: NovelFile;
  content_audio_file: NovelFile;
  video_large_file: NovelFile;
}

export default function ReadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const novelId = searchParams.get("novelId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<ChapterDetail[]>([]);
  const [progress, setProgress] = useState(0);
  const [completedRequests, setCompletedRequests] = useState(0);
  const [totalChapters, setTotalChapters] = useState(0);

  useEffect(() => {
    if (!novelId) {
      setError("Novel ID is required");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const novelRes = await fetch(`/api/novels/${novelId}`);
        const novelData = await novelRes.json();

        if (novelData.error) {
          throw new Error(novelData.error);
        }

        const novelInfo = novelData.novel;
        setNovel(novelInfo);

        const chapterList = novelInfo.chapter_list || [];
        const endingChapterList = novelInfo.ending_chapter_list || [];
        const allChapters = [...chapterList, ...endingChapterList];
        const total = allChapters.length;
        setTotalChapters(total);

        if (total === 0) {
          setLoading(false);
          return;
        }

        let completedCount = 0;
        
        const updateProgress = () => {
          completedCount++;
          setCompletedRequests(completedCount);
          setProgress((completedCount / total) * 100);
        };

        const chapterPromises = allChapters.map(async (chapter) => {
          try {
            const chapterRes = await fetch(`/api/chapters/${chapter.id}`);
            const chapterData = await chapterRes.json();
            updateProgress();
            
            if (!chapterData.error) {
              return chapterData.chapter;
            }
            return null;
          } catch (err) {
            console.error(`Failed to load chapter ${chapter.id}:`, err);
            updateProgress();
            return null;
          }
        });

        const loadedChapters = await Promise.all(chapterPromises);
        const validChapters = loadedChapters.filter((c): c is ChapterDetail => c !== null);
        
        setChapters(validChapters);
        setProgress(100);
        setCompletedRequests(total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load book data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [novelId]);

  if (loading) {
    return (
      <div className="container py-8">
        <LoadingProgress 
          progress={progress} 
          current={completedRequests} 
          total={totalChapters} 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-500">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">{novel?.name}</h1>
      <p className="text-muted-foreground mt-4">
        Loaded {chapters.length} chapters
      </p>
      <p className="text-muted-foreground mt-2">
        Coming soon...
      </p>
    </div>
  );
}
