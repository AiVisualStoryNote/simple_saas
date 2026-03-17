"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { BookPage } from "@/types/book";
import { Pagination } from "@/components/reading-room/pagination";
import { AudioController, AudioControllerRef } from "@/components/reading-room/audio-controller";
import { TableOfContentsDrawer } from "@/components/reading-room/table-of-contents-drawer";
import { TextHighlighter } from "@/components/reading-room/text-highlighter";
import { Button } from "@/components/ui/button";
import { getEndingTypeLabel } from "@/lib/book-utils";
import { List, BookOpen, ChevronLeft, ChevronRight, Shuffle, Users } from "lucide-react";
import { useReadingPreferences } from "@/stores/reading-preferences";
import { CharacterDesignDialog } from "./character-design-dialog";

interface MobileBookReaderProps {
  pages: BookPage[];
  currentPage: number;
  onPageChange: (page: number) => void;
  isAutoReading?: boolean;
  onStartAutoReading?: () => void;
  onStopAutoReading?: () => void;
  onAutoReadingComplete?: () => void;
  mkt?: string | null;
  novelId?: string;
}

export function MobileBookReader({ pages, currentPage, onPageChange, isAutoReading, onStartAutoReading, onStopAutoReading, onAutoReadingComplete, mkt, novelId }: MobileBookReaderProps) {
  const [tocOpen, setTocOpen] = useState(false);
  const [characterDialogOpen, setCharacterDialogOpen] = useState(false);
  const [selectedEndingId, setSelectedEndingId] = useState<number | null>(null);
  const [audioState, setAudioState] = useState({ currentTime: 0, duration: 0, isPlaying: false });
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showSideButtons, setShowSideButtons] = useState(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<AudioControllerRef>(null);

  const [isRandomSelecting, setIsRandomSelecting] = useState(false);
  const [randomSelectedIndex, setRandomSelectedIndex] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const selectionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    setShowSideButtons(true);
    hideTimerRef.current = setTimeout(() => {
      setShowSideButtons(false);
    }, 10000);
  };

  const handleSideButtonClick = (direction: 'prev' | 'next') => {
    resetHideTimer();
    if (direction === 'prev') {
      if (page.type === 'ending-chapter') {
        const endingChoicePageIndex = pages.findIndex(p => p.type === 'ending-choice');
        if (endingChoicePageIndex !== -1) {
          onPageChange(endingChoicePageIndex + 1);
          return;
        }
      }
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    } else if (direction === 'next' && currentPage < pages.length) {
      onPageChange(currentPage + 1);
    }
  };

  const handleContentClick = () => {
    setShowSideButtons(true);
    resetHideTimer();
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      if (selectionTimerRef.current) {
        clearTimeout(selectionTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  const getLastEndingPageIndex = () => {
    if (!selectedEndingId) return null;
    const lastPage = pages
      .filter(p => p.chapterId === selectedEndingId)
      .pop();
    return lastPage?.pageNumber || null;
  };

  const isLastEndingPage = currentPage === getLastEndingPageIndex();

  const handleBackToEndingChoice = () => {
    const endingChoicePage = pages.findIndex(p => p.type === 'ending-choice');
    if (endingChoicePage !== -1) {
      onPageChange(endingChoicePage + 1);
    }
  };

  const endingChoicePageIndex = pages.findIndex(p => p.type === 'ending-choice');
  const visiblePages = selectedEndingId 
    ? pages.length 
    : (endingChoicePageIndex !== -1 ? endingChoicePageIndex + 1 : pages.length);
  const videoRef = useRef<HTMLVideoElement>(null);
  const page = pages[currentPage - 1];
  const { isDynamicVideoEnabled } = useReadingPreferences();

  const startRandomSelection = useCallback(() => {
    if (!page.endingList || page.endingList.length === 0) return;

    setIsRandomSelecting(true);
    setRandomSelectedIndex(null);
    setCountdown(null);

    const totalDuration = 5000 + Math.random() * 5000;
    const totalItems = page.endingList.length;
    let currentTime = 0;
    let currentIndex = 0;
    const baseInterval = 50;
    const maxInterval = 300;

    const selectNext = () => {
      currentIndex = (currentIndex + 1) % totalItems;
      setRandomSelectedIndex(currentIndex);
      currentTime += baseInterval + (currentTime / totalDuration) * maxInterval;

      if (currentTime < totalDuration) {
        const nextDelay = baseInterval + (currentTime / totalDuration) * maxInterval;
        selectionTimerRef.current = setTimeout(selectNext, nextDelay);
      } else {
        setRandomSelectedIndex(currentIndex);
        setIsRandomSelecting(false);
        
        setCountdown(3);
        countdownTimerRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev === null || prev <= 1) {
              if (countdownTimerRef.current) {
                clearInterval(countdownTimerRef.current);
                countdownTimerRef.current = null;
              }
              if (currentIndex !== null && page.endingList && page.endingList[currentIndex]) {
                handleEndingChoice(page.endingList[currentIndex].id);
              }
              setCountdown(null);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }
    };

    selectionTimerRef.current = setTimeout(selectNext, baseInterval);
  }, [page.endingList]);

  if (!page) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No content available</p>
      </div>
    );
  }

  const handleEndingChoice = (chapterId: number) => {
    setSelectedEndingId(chapterId);
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
    if (isAutoReading && page.type === 'ending-choice' && page.endingList && page.endingList.length > 0 && !isRandomSelecting && countdown === null) {
      startRandomSelection();
    }
  }, [isAutoReading, currentPage, page.type, page.endingList, isRandomSelecting, countdown, startRandomSelection]);

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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold text-center px-6 py-3 text-white bg-black/50 backdrop-blur-sm rounded-full">
              {page.textContent}
            </h1>
            {novelId && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCharacterDialogOpen(true)}
                className="gap-2 bg-white/80 hover:bg-white/90"
              >
                <Users className="h-4 w-4" />
                {mkt === "cn" ? "角色设计" : "Character"}
              </Button>
            )}
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
                {page.endingList?.map((ending, index) => (
                  <Button
                    key={ending.id}
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                      if (countdownTimerRef.current) {
                        clearInterval(countdownTimerRef.current);
                        countdownTimerRef.current = null;
                      }
                      setCountdown(null);
                      handleEndingChoice(ending.id);
                    }}
                    className={`w-full h-14 text-lg relative transition-all duration-200 ${
                      randomSelectedIndex === index
                        ? "ring-2 ring-primary scale-105 bg-primary/50 border-primary text-white dark:text-primary-foreground"
                        : ""
                    }`}
                  >
                    {getEndingTypeLabel(ending.ending_type)}
                    {randomSelectedIndex === index && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs animate-pulse">
                        ✓
                      </span>
                    )}
                  </Button>
                ))}
                <Button
                  variant="default"
                  size="lg"
                  onClick={startRandomSelection}
                  disabled={isRandomSelecting || !page.endingList?.length}
                  className="w-full h-14 text-lg mt-2"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  {isRandomSelecting ? (
                    countdown !== null ? (
                      <span className="font-bold">{countdown}</span>
                    ) : (
                      "Selecting..."
                    )
                  ) : (
                    "Random Ending"
                  )}
                </Button>
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
      <div className="flex-1 relative overflow-hidden" onClick={handleContentClick}>
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

        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${showSideButtons ? 'opacity-100' : 'opacity-0'}`}>
          <>
            {currentPage > 1 && page.type !== 'ending-choice' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSideButtonClick('prev');
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 pointer-events-auto"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
            )}
            {currentPage < pages.length && page.type !== 'ending-choice' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSideButtonClick('next');
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 pointer-events-auto"
              >
                <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
            )}
          </>
        </div>
      </div>

      <div className="bg-background border-t">
        <Pagination
          currentPage={currentPage}
          totalPages={visiblePages}
          onPageChange={onPageChange}
          isLastEndingPage={isLastEndingPage}
          onBackToEndingChoice={handleBackToEndingChoice}
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

      {novelId && (
        <CharacterDesignDialog
          novelId={novelId}
          mkt={mkt ?? null}
          open={characterDialogOpen}
          onClose={() => setCharacterDialogOpen(false)}
        />
      )}
    </div>
  );
}
