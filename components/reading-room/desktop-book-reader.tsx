"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BookPage } from "@/types/book";
import { Pagination } from "@/components/reading-room/pagination";
import { AudioController, AudioControllerRef } from "@/components/reading-room/audio-controller";
import { TableOfContentsDrawer } from "@/components/reading-room/table-of-contents-drawer";
import { TextHighlighter } from "@/components/reading-room/text-highlighter";
import { Button } from "@/components/ui/button";
import { getEndingTypeLabel } from "@/lib/book-utils";
import { List, ChevronLeft, ChevronRight } from "lucide-react";

interface DesktopBookReaderProps {
  pages: BookPage[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DesktopBookReader({ pages, currentPage, onPageChange }: DesktopBookReaderProps) {
  const [tocOpen, setTocOpen] = useState(false);
  const [audioState, setAudioState] = useState({ currentTime: 0, duration: 0, isPlaying: false });
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"left" | "right">("right");
  const audioRef = useRef<AudioControllerRef>(null);
  const page = pages[currentPage - 1];

  useEffect(() => {
    setIsFlipping(false);
  }, [currentPage]);

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
      handlePageChange(chapterPageIndex + 1, "right");
    }
  };

  const handlePageChange = (newPage: number, direction: "left" | "right") => {
    if (isFlipping || newPage === currentPage || newPage < 1 || newPage > pages.length) return;
    setFlipDirection(direction);
    setIsFlipping(true);
    setTimeout(() => {
      onPageChange(newPage);
    }, 300);
  };

  const needsHighlighting = page.type === "introduction" || page.type === "paragraph";

  const handleAudioTimeUpdate = (currentTime: number, duration: number, isPlaying: boolean) => {
    setAudioState({ currentTime, duration, isPlaying });
  };

  const handlePrevPage = () => {
    handlePageChange(currentPage - 1, "left");
  };

  const handleNextPage = () => {
    handlePageChange(currentPage + 1, "right");
  };

  const pageVariants = {
    enter: (direction: "left" | "right") => ({
      rotateY: direction === "right" ? 90 : -90,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: "left" | "right") => ({
      rotateY: direction === "right" ? -90 : 90,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const renderRightContent = () => {
    switch (page.type) {
      case "cover":
        return (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center px-4 sm:px-6 lg:px-8 leading-relaxed text-black">
              {page.textContent}
            </h1>
          </div>
        );

      case "introduction":
      case "paragraph":
        return (
          <div className="flex items-center justify-center h-full p-2 sm:p-4 lg:p-6 overflow-hidden">
            <TextHighlighter
              text={page.textContent || ""}
              currentTime={audioState.currentTime}
              duration={audioState.duration}
              isPlaying={audioState.isPlaying}
            />
          </div>
        );

      case "chapter-title":
      case "ending-chapter":
        return (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center px-4 sm:px-6 lg:px-8 leading-relaxed">
              {page.textContent}
              {page.endingType && (
                <span className="block text-sm sm:text-base lg:text-lg font-normal text-muted-foreground mt-2">
                  ({getEndingTypeLabel(page.endingType)})
                </span>
              )}
            </h2>
          </div>
        );

      case "ending-choice":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-3 sm:gap-4 lg:gap-6 p-2 sm:p-4 lg:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-center">Choose Your Ending</h2>
            <div className="flex flex-col gap-2 sm:gap-3 w-full max-w-xs">
              {page.endingList?.map((ending) => (
                <Button
                  key={ending.id}
                  variant="outline"
                  size="lg"
                  onClick={() => handleEndingChoice(ending.id)}
                  className="w-full h-12 sm:h-14 text-base sm:text-lg"
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
      <div className="flex-1 flex min-h-0 p-2 sm:p-3 lg:p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center max-w-[95%]">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none z-10 rounded-lg" />
            
            <AnimatePresence mode="wait" custom={flipDirection}>
              <motion.div
                key={currentPage}
                custom={flipDirection}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="flex w-full h-full max-w-[900px]"
                style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
              >
                <div className="flex-1 flex items-center justify-center min-w-0">
                  <div className="relative w-full h-full max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh] aspect-[3/4] bg-gradient-to-br from-[#FDFBF7] to-[#F5F3EE] rounded-l-lg sm:rounded-l-xl shadow-xl sm:shadow-2xl overflow-hidden border-l-2 sm:border-l-4 border-y-2 sm:border-y-4 border-[#8B5CF6]/20 sm:border-[#8B5CF6]/30">
                    <div className="absolute inset-y-0 left-0 w-1 sm:w-2 bg-gradient-to-r from-[#8B5CF6]/10 to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-0.5 sm:w-1 bg-gradient-to-l from-black/5 to-transparent" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-l-lg sm:rounded-l-xl" />
                    
                    <div className="absolute inset-1 sm:inset-2">
                      {page.imageUrl ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={page.imageUrl}
                            alt="Book image"
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground text-xs sm:text-sm">No image</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center min-w-0">
                  <div className="relative w-full h-full max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh] aspect-[3/4] bg-gradient-to-br from-[#FDFBF7] to-[#F5F3EE] rounded-r-lg sm:rounded-r-xl shadow-xl sm:shadow-2xl overflow-hidden border-r-2 sm:border-r-4 border-y-2 sm:border-y-4 border-[#8B5CF6]/20 sm:border-[#8B5CF6]/30">
                    <div className="absolute inset-y-0 left-0 w-0.5 sm:w-1 bg-gradient-to-r from-black/5 to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-1 sm:w-2 bg-gradient-to-l from-[#8B5CF6]/10 to-transparent" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-r-lg sm:rounded-r-xl" />
                    
                    <div className="absolute inset-2 sm:inset-3 lg:inset-4 overflow-hidden">
                      {renderRightContent()}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isFlipping}
              className="absolute left-1 sm:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 bg-background/80 hover:bg-background/90 shadow-lg rounded-full"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPage === pages.length || isFlipping}
              className="absolute right-1 sm:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 bg-background/80 hover:bg-background/90 shadow-lg rounded-full"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t bg-background">
        <Pagination
          currentPage={currentPage}
          totalPages={pages.length}
          onPageChange={(page) => {
            const direction = page > currentPage ? "right" : "left";
            handlePageChange(page, direction);
          }}
        />
        <div className="flex items-center gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8 pb-4">
          <div className="flex-1 min-w-0">
            <AudioController 
              ref={audioRef}
              audioUrl={page.audioUrl} 
              onTimeUpdate={needsHighlighting ? handleAudioTimeUpdate : undefined}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTocOpen(true)}
            className="h-10 w-10 shrink-0"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <TableOfContentsDrawer
        pages={pages}
        isOpen={tocOpen}
        onClose={() => setTocOpen(false)}
        onNavigate={(pageNum) => {
          const direction = pageNum > currentPage ? "right" : "left";
          handlePageChange(pageNum, direction);
        }}
      />
    </div>
  );
}
