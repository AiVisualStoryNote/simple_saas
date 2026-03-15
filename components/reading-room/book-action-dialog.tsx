"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Headphones, BookOpen, X, Play, Pause } from "lucide-react";
import { useRouter } from "next/navigation";

import { Novel as NovelType } from "@/types/book";

interface BookActionDialogProps {
  novel: NovelType | null;
  open: boolean;
  onClose: () => void;
}

export function BookActionDialog({ novel, open, onClose }: BookActionDialogProps) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleRead = () => {
    // Stop audio when starting to read
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    router.push(`/read?novelId=${novel?.id}`);
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
  };

  // Clean up audio when dialog closes
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

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
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium">Introduction</h4>
                      {introAudio && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleAudioPlayPause}
                          className="h-8 w-8"
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    <div className="prose max-w-none text-sm text-muted-foreground line-clamp-6 overflow-y-auto max-h-48 pr-2">
                      {novel.overall_introduction}
                    </div>
                  </div>
                )}

                {/* Hidden audio element */}
                {introAudio && (
                  <audio
                    ref={audioRef}
                    src={introAudio.file_url}
                    onEnded={handleAudioEnded}
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
                    开始阅读
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
