"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { BookPage } from "@/types/book";
import { Pagination } from "@/components/reading-room/pagination";
import { AudioController, AudioControllerRef } from "@/components/reading-room/audio-controller";
import { TableOfContentsDrawer } from "@/components/reading-room/table-of-contents-drawer";
import { TextHighlighter } from "@/components/reading-room/text-highlighter";
import { Button } from "@/components/ui/button";
import { getEndingTypeLabel } from "@/lib/book-utils";
import { List, BookOpen } from "lucide-react";
import { useReadingPreferences } from "@/stores/reading-preferences";

interface DesktopBookReaderProps {
  pages: BookPage[];
  currentPage: number;
  onPageChange: (page: number) => void;
  isAutoReading?: boolean;
  onStartAutoReading?: () => void;
  onStopAutoReading?: () => void;
  onAutoReadingComplete?: () => void;
}

export function DesktopBookReader({ pages, currentPage, onPageChange, isAutoReading, onStartAutoReading, onStopAutoReading, onAutoReadingComplete }: DesktopBookReaderProps) {
  const [tocOpen, setTocOpen] = useState(false);
  const [audioState, setAudioState] = useState({ currentTime: 0, duration: 0, isPlaying: false });
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const audioRef = useRef<AudioControllerRef>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const page = pages[currentPage - 1];
  const { isDynamicVideoEnabled } = useReadingPreferences();

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

  const needsHighlighting = page.type === "introduction" || page.type === "paragraph";
  const shouldShowVideo = isDynamicVideoEnabled && page.videoUrl && page.pageNumber !== 1;

  useEffect(() => {
    setVideoLoaded(false);
    setIsVideoPlaying(false);
  }, [currentPage, page.videoUrl, isDynamicVideoEnabled]);

  useEffect(() => {
    if (shouldShowVideo && videoRef.current) {
      videoRef.current.load();
    }
  }, [shouldShowVideo, page]);

  const handleVideoCanPlay = () => {
    setVideoLoaded(true);
    videoRef.current?.play();
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleAudioTimeUpdate = (currentTime: number, duration: number, isPlaying: boolean) => {
    setAudioState({ currentTime, duration, isPlaying });
  };

  useEffect(() => {
    if (isAutoReading && page.audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  }, [currentPage, isAutoReading, page.audioUrl]);

  const handleAudioEnded = () => {
    if (isAutoReading && currentPage < pages.length) {
      onPageChange(currentPage + 1);
    } else if (isAutoReading && currentPage >= pages.length) {
      if (onStopAutoReading) {
        onStopAutoReading();
      }
      if (onAutoReadingComplete) {
        onAutoReadingComplete();
      }
    }
  };

  const handleReadButtonClick = async () => {
    if (isAutoReading) {
      if (onStopAutoReading) {
        onStopAutoReading();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      if (onStartAutoReading) {
        onStartAutoReading();
      }
      if (audioRef.current && page.audioUrl) {
        await audioRef.current.play();
      }
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
      case "paragraph":
        return (
          <div className="flex items-center justify-center h-full p-8 overflow-hidden">
            <TextHighlighter
              text={page.textContent || ""}
              currentTime={audioState.currentTime}
              duration={audioState.duration}
              isPlaying={audioState.isPlaying}
              highlightedClassName="text-primary dark:text-yellow-400"
            />
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
        <div className="w-1/2 flex items-center justify-center bg-muted/20 p-4">
          {shouldShowVideo ? (
            <div className="relative w-full h-full max-h-[70vh] aspect-[3/4]">
              <video
                ref={videoRef}
                src={page.videoUrl}
                className={`w-full h-full object-contain transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                playsInline
                muted
                loop
                onCanPlay={handleVideoCanPlay}
                onPlay={handleVideoPlay}
              />
              <Image
                src={page.imageUrl!}
                alt="Book image"
                fill
                className={`w-full h-full object-contain transition-opacity duration-1000 ${!videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                priority
              />
            </div>
          ) : page.imageUrl ? (
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

        <div className="w-1/2 flex items-center justify-center bg-background border-l">
          {renderRightContent()}
        </div>
      </div>

      <div className="border-t bg-background">
        <Pagination
          currentPage={currentPage}
          totalPages={pages.length}
          onPageChange={onPageChange}
        />
        <div className="flex items-center gap-4 px-8 pb-4">
          {page.audioUrl && (
            <Button
              variant={isAutoReading ? "default" : "outline"}
              size="icon"
              onClick={handleReadButtonClick}
              className="h-10 w-10 shrink-0"
            >
              <BookOpen className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1">
            <AudioController 
              ref={audioRef}
              audioUrl={page.audioUrl} 
              onTimeUpdate={needsHighlighting ? handleAudioTimeUpdate : undefined}
              onEnded={handleAudioEnded}
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
        onNavigate={onPageChange}
      />
    </div>
  );
}
