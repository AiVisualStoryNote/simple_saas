"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Headphones, BookOpen, X, Play, Pause, Coins } from "lucide-react";
import { useRouter } from "next/navigation";

import { Novel as NovelType } from "@/types/book";
import { IntroTextHighlighter } from "@/components/reading-room/intro-text-highlighter";
import { PurchaseConfirmDialog } from "@/components/reading-room/purchase-confirm-dialog";
import { checkUserBookPurchase, getCustomerCredits, purchaseBook } from "@/lib/book-purchase";
import { useUser } from "@/hooks/use-user";
import { toast } from "@/hooks/use-toast";

interface BookActionDialogProps {
  mkt?: string | null;
  novel: NovelType | null;
  open: boolean;
  onClose: () => void;
}

export function BookActionDialog({ mkt, novel, open, onClose }: BookActionDialogProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const introScrollRef = useRef<HTMLDivElement>(null);

  const [hasPurchased, setHasPurchased] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [loadingPurchase, setLoadingPurchase] = useState(true);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const isCN = mkt === 'cn';
  const bookCredits = novel?.credits ?? 0;
  const isFree = bookCredits === 0;

  useEffect(() => {
    if (!open || !novel) {
      setLoadingPurchase(true);
      setHasPurchased(false);
      setShowPurchaseDialog(false);
      return;
    }

    const checkPurchase = async () => {
      if (!user) {
        setHasPurchased(false);
        setUserCredits(0);
        setLoadingPurchase(false);
        return;
      }

      try {
        const [purchased, credits] = await Promise.all([
          checkUserBookPurchase(novel.id),
          getCustomerCredits(),
        ]);
        setHasPurchased(purchased);
        setUserCredits(credits);
      } catch (error) {
        console.error('Error checking purchase:', error);
      } finally {
        setLoadingPurchase(false);
      }
    };

    checkPurchase();
  }, [open, novel, user]);

  const handleRead = () => {
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

  const handleBuyClick = () => {
    setShowPurchaseDialog(true);
  };

  const handlePurchaseConfirm = async () => {
    if (!novel) return;

    setPurchasing(true);
    try {
      const result = await purchaseBook(novel.id, bookCredits, novel.name, isCN);
      if (result.success) {
        setHasPurchased(true);
        if (bookCredits > 0) {
          setUserCredits((prev) => prev - bookCredits);
        }
        toast({
          title: isCN ? "购买成功！" : "Purchase Successful!",
          description: isCN 
            ? `您已成功购买《${novel.name}》，现在可以阅读了。`
            : `You have successfully purchased "${novel.name}". You can now read it.`,
        });
      } else {
        throw new Error(result.error || 'Purchase failed');
      }
    } catch (error) {
      toast({
        title: isCN ? "购买失败" : "Purchase Failed",
        description: error instanceof Error ? error.message : (isCN ? "购买过程中出现错误" : "An error occurred during purchase"),
        variant: "destructive",
      });
      throw error;
    } finally {
      setPurchasing(false);
    }
  };

  const handleClosePurchaseDialog = () => {
    setShowPurchaseDialog(false);
  };

  const coverVideo = novel?.files?.find(
    (file) => file.file_type === "video" && file.file_name.startsWith("cover_video")
  );

  const coverImage = novel?.files?.find((file) => file.file_type === "image");

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

  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  const renderActionButton = () => {
    if (loadingPurchase) {
      return (
        <Button className="w-full h-12" disabled>
          {isCN ? '加载中...' : 'Loading...'}
        </Button>
      );
    }

    if (!user) {
      return (
        <Button
          className="w-full h-12 gap-2"
          onClick={() => router.push('/sign-in')}
        >
          <BookOpen className="h-4 w-4" />
          {isCN ? '登录后阅读' : 'Sign in to Read'}
        </Button>
      );
    }

    if (hasPurchased) {
      return (
        <Button
          className="w-full h-12 gap-2"
          onClick={handleRead}
        >
          <BookOpen className="h-4 w-4" />
          {isCN ? '阅读' : 'Read'}
        </Button>
      );
    }

    return (
      <Button
        className="w-full h-12 gap-2"
        onClick={handleBuyClick}
      >
        <Coins className="h-4 w-4 text-yellow-500" />
        {isCN ? '购买' : 'Buy'} {isFree ? (
          <span className="text-green-500">{isCN ? '免费' : 'Free'}</span>
        ) : bookCredits}
      </Button>
    );
  };

  return (
    <>
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

                  {novel.overall_introduction && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-medium flex-1">
                          {isCN ? '简介' : 'Introduction'}
                        </h4>
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

                  <div className="pt-4 border-t">
                    {!loadingPurchase && user && !hasPurchased && (
                      <div className="flex items-center justify-between mb-3 text-sm">
                        <span className="text-muted-foreground">
                          {isCN ? '价格' : 'Price'}
                        </span>
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">
                            {isFree ? (
                              <span className="text-green-500">{isCN ? '免费' : 'Free'}</span>
                            ) : bookCredits}
                          </span>
                        </div>
                      </div>
                    )}
                    {renderActionButton()}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <PurchaseConfirmDialog
        open={showPurchaseDialog}
        bookName={novel?.name || ''}
        bookCredits={bookCredits}
        userCredits={userCredits}
        isCN={isCN}
        onClose={handleClosePurchaseDialog}
        onConfirm={handlePurchaseConfirm}
      />
    </>
  );
}
