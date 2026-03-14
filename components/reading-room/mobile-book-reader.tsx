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

interface MobileBookReaderProps {
  pages: BookPage[];
  currentPage: number;
  onPageChange: (page: number) => void;
  isAutoReading?: boolean;
  onStartAutoReading?: () => void;
  onStopAutoReading?: () => void;
  onAutoReadingComplete?: () => void;
}

export function MobileBookReader({ pages, currentPage, onPageChange, isAutoReading, onStartAutoReading, onStopAutoReading, onAutoReadingComplete }: MobileBookReaderProps) {
  const [tocOpen, setTocOpen] = useState(false);
  const [audioState, setAudioState] = useState({ currentTime: 0, duration: 0, isPlaying: false });
  const [videoLoaded, setVideoLoaded] = useState(false);
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
  }, [currentPage, page.videoUrl, isDynamicVideoEnabled]);

  useEffect(() => {
    if (shouldShowVideo && videoRef.current) {
      videoRef.current.load();
    }
  }, [shouldShowVideo, page.videoUrl]);

  const handleVideoCanPlay = () => {
    setVideoLoaded(true);
    videoRef.current?.play();
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

  const renderOverlayContent = () => {
    switch (page.type) {
      case "cover":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-center px-6 py-3 text-white bg-black/50 backdrop-blur-sm rounded-full">
              {page.textContent}
            </h1>
          </div>
        );

      case "introduction":
        return (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-3xl font-bold text-center px-6 py-3 text-white bg-black/50 backdrop-blur-sm rounded-full">
                Story Introduction
              </h1>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm pb-4 px-4" style={{ height: '10vh' }}>
              <TextHighlighter
                text={page.textContent || ""}
                currentTime={audioState.currentTime}
                duration={audioState.duration}
                isPlaying={audioState.isPlaying}
              />
            </div>
          </>
        );

      case "paragraph":
        return (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm pb-4 px-4" style={{ height: '10vh' }}>
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
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm pt-4 pb-4 px-4">
            <div className="max-h-[20vh] overflow-y-auto scrollbar-hide">
              <p className="text-white text-lg font-medium text-center text-xl">
                {page.textContent}
                {page.endingType && (
                  <span className="block text-sm font-normal opacity-80 mt-1">
                    ({getEndingTypeLabel(page.endingType)})
                  </span>
                )}
              </p>
            </div>
          </div>
        );

      case "ending-choice":
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="flex flex-col gap-4 p-8 w-full max-w-xs">
              <h2 className="text-2xl font-semibold text-center text-white">Choose Your Ending</h2>
              <div className="flex flex-col gap-3">
                {page.endingList?.map((ending) => (
                  <Button
                    key={ending.id}
                    variant="secondary"
                    size="lg"
                    onClick={() => handleEndingChoice(ending.id)}
                    className="w-full h-14 text-lg"
                  >
                    {getEndingTypeLabel(ending.ending_type)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative overflow-hidden">
        {shouldShowVideo ? (
          <>
          <video
            ref={videoRef}
            src={page.videoUrl}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            playsInline
            muted
            loop
            onCanPlay={handleVideoCanPlay}
          />
          <Image
            src={page.imageUrl!}
            alt="Book image"
            fill
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${!videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            priority
          />
          </>
        ) : page.imageUrl ? (
          <Image
            src={page.imageUrl}
            alt="Book image"
            fill
            className="object-cover animate-scale-loop"
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">No image</p>
          </div>
        )}

        {renderOverlayContent()}
      </div>

      <div className="bg-background border-t">
        <Pagination
          currentPage={currentPage}
          totalPages={pages.length}
          onPageChange={onPageChange}
        />
        <div className="flex items-center gap-4 px-4 pb-4">
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
              hideAudioSlider={true}
              onTimeUpdate={needsHighlighting ? handleAudioTimeUpdate : undefined}
              onEnded={handleAudioEnded}
            />
          </div>
          {!page.isShortStory && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTocOpen(true)}
              className="h-10 w-10 shrink-0"
            >
              <List className="h-5 w-5" />
            </Button>
          )}
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
