"use client";

import Image from "next/image";
import { BookPage } from "@/types/book";
import { Pagination } from "@/components/reading-room/pagination";
import { AudioController } from "@/components/reading-room/audio-controller";
import { Button } from "@/components/ui/button";
import { getEndingTypeLabel } from "@/lib/book-utils";
import { useRouter } from "next/navigation";

interface DesktopBookReaderProps {
  pages: BookPage[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DesktopBookReader({ pages, currentPage, onPageChange }: DesktopBookReaderProps) {
  const router = useRouter();
  const page = pages[currentPage - 1];

  if (!page) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No content available</p>
      </div>
    );
  }

  const handleEndingChoice = (chapterId: number) => {
    const chapterPageIndex = pages.findIndex(
      (p) => p.chapterId === chapterId && p.type === "ending-chapter"
    );
    if (chapterPageIndex !== -1) {
      onPageChange(chapterPageIndex + 1);
    }
  };

  const renderRightContent = () => {
    switch (page.type) {
      case "cover":
        return (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-4xl font-bold text-center px-8">{page.textContent}</h1>
          </div>
        );

      case "introduction":
        return (
          <div className="flex items-center justify-center h-full p-8 overflow-auto">
            <p className="text-lg leading-relaxed text-center">{page.textContent}</p>
          </div>
        );

      case "chapter-title":
      case "ending-chapter":
        return (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-3xl font-semibold text-center px-8">
              {page.textContent}
              {page.endingType && (
                <span className="block text-lg font-normal text-muted-foreground mt-2">
                  ({getEndingTypeLabel(page.endingType)})
                </span>
              )}
            </h2>
          </div>
        );

      case "paragraph":
        return (
          <div className="flex items-center justify-center h-full p-8 overflow-auto">
            <p className="text-xl leading-loose">{page.textContent}</p>
          </div>
        );

      case "ending-choice":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
            <h2 className="text-2xl font-semibold text-center">Choose Your Ending</h2>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              {page.endingList?.map((ending) => (
                <Button
                  key={ending.id}
                  variant="outline"
                  size="lg"
                  onClick={() => handleEndingChoice(ending.id)}
                  className="w-full h-14 text-lg"
                >
                  {getEndingTypeLabel(ending.ending_type)}
                </Button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex min-h-0">
        {/* Left page - Image */}
        <div className="w-1/2 flex items-center justify-center bg-muted/20 p-4">
          {page.imageUrl ? (
            <div className="relative w-full h-full max-h-[70vh] aspect-[3/4]">
              <Image
                src={page.imageUrl}
                alt="Book image"
                fill
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No image</p>
            </div>
          )}
        </div>

        {/* Right page - Content */}
        <div className="w-1/2 flex items-center justify-center bg-background border-l">
          {renderRightContent()}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="border-t bg-background">
        <Pagination
          currentPage={currentPage}
          totalPages={pages.length}
          onPageChange={onPageChange}
        />
        <div className="px-8 pb-4">
          <AudioController audioUrl={page.audioUrl} />
        </div>
      </div>
    </div>
  );
}
