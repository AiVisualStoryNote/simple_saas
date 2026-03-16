"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Headphones, BookOpen, X, Play, Pause } from "lucide-react";
import { useRouter } from "next/navigation";

import { Novel as NovelType } from "@/types/book";
import { IntroTextHighlighter } from "@/components/reading-room/intro-text-highlighter";

interface BookActionDialogProps {
  mkt?: string | null; // 市场参数，用于API调用(默认值为空，即海外市场)
  novel: NovelType | null;
  open: boolean;
  onClose: () => void;
}

export function BookActionDialog({ mkt, novel, open, onClose }: BookActionDialogProps) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const introScrollRef = useRef<HTMLDivElement>(null);

  const handleRead = () => {
    // Stop audio when starting to read
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    if (mkt) {
      router.push(`/read?mkt=${mkt}&novelId=${novel?.id}`);
    } else {
      router.push(`/read?novelId=${novel?.id}`);
    }
    onClose();
  };

  // Get cover video (file_name starts with 'cover_video')
  const coverVideo = novel?.files?.find(
    (file) => file.file_type === "video" && file.file_name.startsWith("cover_video")
  );

  // Get cover image as fallback
  const coverImage = novel?.files?.find((file) => file.file_type === "image");

  // Get intro audio (file_name starts with 'intro_audio')
  const introAudio = novel?.files?.find(
    (file) => file.file_type === "audio" && file.file_name.startsWith("intro_audio")
  );

  const handleAudioPlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleAudioStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  // Clean up audio when dialog closes
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
  }, []);

  // Disable body scroll when dialog is open
  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && novel && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="bg-background rounded-lg shadow-xl pointer-events-auto max-w-2xl w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-semibold">{novel.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Cover media */}
                {coverVideo ? (
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <video
                      src={coverVideo.file_url}
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-cover"
                      playsInline
                    />
                  </div>
                ) : coverImage ? (
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={coverImage.file_url}
                      alt={novel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}

                {/* Story introduction */}
                {novel.overall_introduction && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-medium flex-1">Introduction</h4>
                      {/* Compact audio controller */}
                      {introAudio && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleAudioPlayPause}
                            className="h-6 w-6"
                          >
                            {isPlaying ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleAudioStop}
                            className="h-6 w-6"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="6" y="6" width="12" height="12" />
                            </svg>
                          </Button>
                          <div className="w-24 min-w-[60px] flex items-center">
                            <input
                              type="range"
                              min="0"
                              max={duration || 100}
                              value={currentTime}
                              onChange={handleSeek}
                              className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, currentColor ${(currentTime / (duration || 1)) * 100}%, transparent ${(currentTime / (duration || 1)) * 100}%)`
                              }}
                            />
                            <style jsx>{`
                              input[type="range"]::-webkit-slider-thumb {
                                appearance: none;
                                width: 8px;
                                height: 8px;
                                border-radius: 50%;
                                background: currentColor;
                                cursor: pointer;
                              }
                              input[type="range"]::-moz-range-thumb {
                                width: 8px;
                                height: 8px;
                                border-radius: 50%;
                                background: currentColor;
                                cursor: pointer;
                                border: none;
                              }
                            `}</style>
                          </div>
                          <span className="text-xs text-muted-foreground min-w-[40px] text-right">
                            {Math.floor(currentTime / 60).toString().padStart(2, '0')}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div 
                      ref={introScrollRef}
                      className="prose max-w-none text-sm text-muted-foreground max-h-48 overflow-y-auto"
                    >
                      <IntroTextHighlighter
                        text={novel.overall_introduction}
                        currentTime={currentTime}
                        duration={duration}
                        isPlaying={isPlaying}
                        highlightedClassName="text-primary dark:text-primary-foreground"
                        scrollContainerRef={introScrollRef}
                      />
                    </div>
                  </div>
                )}

                {/* Hidden audio element */}
                {introAudio && (
                  <audio
                    ref={audioRef}
                    src={introAudio.file_url}
                    onEnded={handleAudioEnded}
                    onTimeUpdate={handleAudioTimeUpdate}
                    onLoadedMetadata={handleAudioLoadedMetadata}
                    className="hidden"
                  />
                )}

                {/* Action button */}
                <div className="pt-4 border-t">
                  <Button
                    className="w-full h-12 gap-2"
                    onClick={handleRead}
                  >
                    <BookOpen className="h-4 w-4" />
                    Read
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
