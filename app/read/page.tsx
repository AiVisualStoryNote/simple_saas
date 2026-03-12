"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingProgress } from "@/components/reading-room/loading-progress";
import { ResponsiveBookReader } from "@/components/reading-room/responsive-book-reader";
import { Button } from "@/components/ui/button";
import { Novel, ChapterDetail } from "@/types/book";
import { buildBookPages } from "@/lib/book-utils";

function ReadPageContent() {
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
  const [currentPage, setCurrentPage] = useState(1);

  const pages = useMemo(() => {
    if (!novel) return [];
    return buildBookPages(novel, chapters);
  }, [novel, chapters]);

  useEffect(() => {
    if (!novelId) return;

    setLoading(true);
    setError(null);
    setNovel(null);
    setChapters([]);
    setProgress(0);
    setCompletedRequests(0);

    const fetchNovel = async () => {
      try {
        const novelRes = await fetch(`/api/novels/${novelId}`);
        
        if (!novelRes.ok) {
          throw new Error(`Failed to fetch novel: ${novelRes.status}`);
        }
        
        const novelData = await novelRes.json();

        if (novelData.error) {
          throw new Error(novelData.error);
        }

        const novelInfo: Novel = novelData.novel;
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

        const loadedChapters: ChapterDetail[] = [];
        let completedCount = 0;

        for (const chapter of allChapters) {
          try {
            const chapterRes = await fetch(`/api/chapters/${chapter.id}`);
            
            if (!chapterRes.ok) {
              console.warn(`Failed to fetch chapter ${chapter.id}`);
              continue;
            }
            
            const chapterData = await chapterRes.json();
            
            if (!chapterData.error && chapterData.chapter) {
              loadedChapters.push(chapterData.chapter);
            }
          } catch (err) {
            console.warn(`Failed to load chapter ${chapter.id}:`, err);
          }
          
          completedCount++;
          setCompletedRequests(completedCount);
          setProgress((completedCount / total) * 100);
        }

        setChapters(loadedChapters);
        setProgress(100);
        setCompletedRequests(total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load book data");
      } finally {
        setLoading(false);
      }
    };

    fetchNovel();
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
          <h2 className="text-xl font-semibold text-red-500">Failed to Load</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="container py-20">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">No Content</h2>
          <p className="text-muted-foreground">This book has no chapters yet.</p>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ResponsiveBookReader
        pages={pages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default function ReadPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-8">
          <LoadingProgress progress={0} current={0} total={0} />
        </div>
      }
    >
      <ReadPageContent />
    </Suspense>
  );
}
