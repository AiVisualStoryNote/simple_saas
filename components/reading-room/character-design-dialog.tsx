"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, RotateCcw, Coins } from "lucide-react";
import { request } from "@/lib/request";
import { toast } from "@/hooks/use-toast";
import {
  Character,
  getRandomCharacter,
  getUserUnlockedCharacterIds,
  unlockCharacter,
} from "@/lib/character";
import { useUser } from "@/hooks/use-user";

interface NovelFile {
  id: number;
  file_type: string;
  file_url: string;
  file_name: string;
}

interface CharactersResponse {
  characters: Character[];
}

interface CharacterDesignDialogProps {
  novelId: string;
  novelName?: string;
  mkt: string | null;
  open: boolean;
  onClose: () => void;
}

const getLocalizedType = (type: string, isCN: boolean) => {
  return type;
};

export function CharacterDesignDialog({
  novelId,
  novelName = "",
  mkt,
  open,
  onClose,
}: CharacterDesignDialogProps) {
  const { user } = useUser();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [unlockedCharacterIds, setUnlockedCharacterIds] = useState<number[]>([]);
  const [userCredits, setUserCredits] = useState(0);
  const [loadingUnlocked, setLoadingUnlocked] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [animatingCharacterName, setAnimatingCharacterName] = useState("");
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [drawCardLoading, setDrawCardLoading] = useState(false);
  const [resultCharacter, setResultCharacter] = useState<Character | null>(null);
  const [resultIsNewUnlock, setResultIsNewUnlock] = useState<boolean | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isCN = mkt === "cn";

  useEffect(() => {
    if (open && novelId) {
      fetchCharacters();
      fetchUnlockedCharacters();
      fetchUserCredits();
      setDrawCardLoading(false);
      setIsAnimating(false);
      setShowResult(false);
      setResultCharacter(null);
      setSelectedCharacterId(null);
      setResultIsNewUnlock(null);
    }
  }, [open, novelId]);

  useEffect(() => {
    if (open && user) {
      fetchUnlockedCharacters();
      fetchUserCredits();
    } else if (!user) {
      setUnlockedCharacterIds([]);
      setUserCredits(0);
    }
  }, [open, user, novelId]);

  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  const fetchCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await request<CharactersResponse>(`/api/novels/${novelId}/characters`, { mkt });
      if (res.error) {
        setError(res.error);
      } else {
        setCharacters(res.data?.characters || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch characters");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnlockedCharacters = async () => {
    setLoadingUnlocked(true);
    try {
      const ids = await getUserUnlockedCharacterIds(Number(novelId));
      setUnlockedCharacterIds(ids);
    } catch (err) {
      console.error('Error fetching unlocked characters:', err);
    } finally {
      setLoadingUnlocked(false);
    }
  };

  const fetchUserCredits = async () => {
    try {
      const { getCustomerCredits } = await import("@/lib/book-purchase");
      const credits = await getCustomerCredits();
      setUserCredits(credits);
    } catch (err) {
      console.error('Error fetching credits:', err);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
  };

  const handleZoomIn = () => {};
  const handleZoomOut = () => {};
  const handleReset = () => {};
  const handleDoubleClick = () => {};
  const handleMouseDown = () => {};
  const handleMouseMove = () => {};
  const handleMouseUp = () => {};

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  const handleDrawCardClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDrawCard = async () => {
    if (!user || characters.length === 0) return;

    setDrawCardLoading(true);

    const result = getRandomCharacter(characters);
    if (!result) {
      toast({
        title: isCN ? "抽卡失败" : "Draw Failed",
        description: isCN ? "没有可抽的角色" : "No characters available",
        variant: "destructive",
      });
      setDrawCardLoading(false);
      return;
    }

    const { index, character } = result;

    const unlockResult = await unlockCharacter(
      Number(novelId),
      character.id,
      novelName,
      1
    );

    if (!unlockResult.success) {
      toast({
        title: isCN ? "抽卡失败" : "Draw Failed",
        description: unlockResult.error || (isCN ? "请稍后重试" : "Please try again later"),
        variant: "destructive",
      });
      setDrawCardLoading(false);
      return;
    }

    await fetchUnlockedCharacters();
    await fetchUserCredits();
    setShowConfirmDialog(false);

    const isNew = unlockResult.isNewUnlock ?? false;
    setResultIsNewUnlock(isNew);
    startAnimation(character, index, isNew);
  };

  const startAnimation = (finalCharacter: Character, finalIndex: number, isNewUnlock: boolean) => {
    setIsAnimating(true);
    setSelectedCharacterId(null);
    setShowResult(false);
    setResultCharacter(null);
    setResultIsNewUnlock(isNewUnlock);

    const duration = 3000 + Math.random() * 4000;
    const interval = 100;

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= duration) {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
        }
        
        setAnimatingCharacterName(finalCharacter.name);
        setSelectedCharacterId(finalCharacter.id);
        setResultCharacter(finalCharacter);
        setIsAnimating(false);
        setShowResult(true);

        setTimeout(() => {
          setShowResult(false);
          setDrawCardLoading(false);
          
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (listRef.current) {
                const cardElement = listRef.current.children[finalIndex] as HTMLElement;
                if (cardElement) {
                  cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }
            });
          });
        }, 5000);

        return;
      }

      const randomChar = characters[Math.floor(Math.random() * characters.length)];
      setAnimatingCharacterName(randomChar.name);

      animationIntervalRef.current = setTimeout(animate, interval);
    };

    animate();
  };

  const isCharacterUnlocked = (characterId: number) => {
    return unlockedCharacterIds.includes(characterId);
  };

  const canDraw = user && !loadingUnlocked && unlockedCharacterIds.length < characters.length;

  const renderCharacterCard = (character: Character, index: number) => {
    const isUnlocked = isCharacterUnlocked(character.id);
    const isAnimatingThis = isAnimating && selectedCharacterId !== character.id;

    if (isAnimating) {
      return null;
    }

    return (
      <div
        key={character.id}
        className={`bg-card rounded-xl overflow-hidden border transition-all ${
          isUnlocked ? "hover:shadow-lg" : "opacity-60"
        }`}
        onClick={() => isUnlocked && character.design_img?.file_url && setSelectedImage(character.design_img.file_url)}
      >
        <div
          className={`relative w-full aspect-[4/3] ${
            isUnlocked ? "cursor-pointer" : "cursor-not-allowed"
          }`}
        >
          {character.design_img?.file_url ? (
            <Image
              src={character.design_img.file_url}
              alt={character.name}
              fill
              className={`object-cover transition-all ${
                !isUnlocked ? "blur-md grayscale opacity-40" : "hover:opacity-90"
              }`}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">{isCN ? "无图片" : "No image"}</span>
            </div>
          )}
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{character.name}</h3>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              {getLocalizedType(character.type, isCN)}
            </span>
          </div>
          {isUnlocked ? (
            <>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    {isCN ? "年龄" : "Age"}:{" "}
                  </span>{" "}
                  <span className="font-medium">{character.age_type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    {isCN ? "物种" : "Species"}:{" "}
                  </span>{" "}
                  <span className="font-medium">{character.species}</span>
                </div>
              </div>
              {character.text && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {character.text}
                </p>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
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
              className="bg-background rounded-lg shadow-xl pointer-events-auto max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b shrink-0">
                <h2 className="text-xl font-semibold">
                  {isCN ? "角色设计" : "Character Designs"}
                </h2>
                <div className="flex items-center gap-2">
                  {canDraw && !isAnimating && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleDrawCardClick}
                      className="gap-1"
                    >
                      <Coins className="h-4 w-4 text-yellow-500" />
                      {isCN ? "抽卡" : "Draw"} (1)
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4" ref={listRef}>
                {loading || loadingUnlocked ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : error ? (
                  <div className="text-center py-20 text-red-500">
                    <p>{error}</p>
                  </div>
                ) : characters.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground">
                    <p>{isCN ? "暂无角色设计" : "No character designs available"}</p>
                  </div>
                ) : isAnimating ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-8">
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold text-primary"
                    >
                      {animatingCharacterName}
                    </motion.div>
                    <div className="w-full max-w-sm bg-card rounded-xl overflow-hidden border-2 border-primary/50 shadow-lg">
                      <div className="relative w-full aspect-[4/3]">
                        {animatingCharacterName && (
                          <Image
                            src={characters.find(c => c.name === animatingCharacterName)?.design_img?.file_url || ""}
                            alt={animatingCharacterName}
                            fill
                            className="object-cover blur-md grayscale opacity-40"
                          />
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{animatingCharacterName}</h3>
                          {animatingCharacterName && (
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                              {getLocalizedType(characters.find(c => c.name === animatingCharacterName)?.type || "", isCN)}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                          <div className="h-4 bg-muted rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      {isCN ? "正在抽取角色..." : "Drawing character..."}
                    </p>
                  </div>
                ) : showResult && resultCharacter ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-8">
                    {resultIsNewUnlock ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent"
                        >
                          {isCN ? "🎉 恭喜获得 🎉" : "🎉 Congratulations! 🎉"}
                        </motion.div>
                        
                        <motion.div
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ 
                            duration: 0.6, 
                            repeat: Infinity, 
                            repeatType: "reverse" 
                          }}
                          className="relative"
                        >
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 animate-spin-slow blur-lg opacity-75"></div>
                          <div className="relative w-72 rounded-2xl overflow-hidden border-4 border-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 p-[3px]">
                            <div className="bg-background rounded-xl overflow-hidden">
                              {resultCharacter.design_img?.file_url ? (
                                <div className="relative w-full aspect-[4/3]">
                                  <Image
                                    src={resultCharacter.design_img.file_url}
                                    alt={resultCharacter.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
                                  <span className="text-muted-foreground">{isCN ? "无图片" : "No image"}</span>
                                </div>
                              )}
                              <div className="p-4 text-center">
                                <h3 className="text-2xl font-bold text-primary">{resultCharacter.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {getLocalizedType(resultCharacter.type, isCN)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        <p className="text-muted-foreground">
                          {isCN ? "恭喜获得新角色！" : "You got a new character!"}
                        </p>
                      </>
                    ) : (
                      <>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent"
                        >
                          {isCN ? "✨ 已拥有 ✨" : "✨ Already Owned ✨"}
                        </motion.div>
                        
                        <motion.div
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ 
                            duration: 0.8, 
                            repeat: Infinity, 
                            repeatType: "reverse" 
                          }}
                          className="relative"
                        >
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-400 animate-pulse blur-lg opacity-50"></div>
                          <div className="relative w-72 rounded-2xl overflow-hidden border-4 border-blue-500/50 bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-400 p-[3px]">
                            <div className="bg-background rounded-xl overflow-hidden">
                              {resultCharacter.design_img?.file_url ? (
                                <div className="relative w-full aspect-[4/3]">
                                  <Image
                                    src={resultCharacter.design_img.file_url}
                                    alt={resultCharacter.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
                                  <span className="text-muted-foreground">{isCN ? "无图片" : "No image"}</span>
                                </div>
                              )}
                              <div className="p-4 text-center">
                                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{resultCharacter.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {getLocalizedType(resultCharacter.type, isCN)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        <p className="text-muted-foreground">
                          {isCN ? "该角色已拥有，下次好运！" : "You already own this character!"}
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {characters.map((character, index) =>
                      renderCharacterCard(character, index)
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center"
                onClick={handleClosePreview}
              >
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative max-w-full max-h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={selectedImage}
                    alt="Character design"
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showConfirmDialog && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-[60]"
                  onClick={() => setShowConfirmDialog(false)}
                />
                <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-background rounded-lg shadow-xl pointer-events-auto max-w-sm w-full mx-4 p-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      {isCN ? "确认抽卡" : "Confirm Draw"}
                    </h3>

                    <div className="mb-6">
                      <div className="rounded-xl p-4 text-center bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Coins className="h-5 w-5 text-yellow-500" />
                          <span className="text-sm text-muted-foreground">
                            {isCN ? "消耗积分" : "Cost"}
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          1
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground">
                          {isCN ? "本次抽卡" : "This draw"}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        <div className="flex-1 h-px bg-border"></div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-muted-foreground">
                          {isCN ? "当前积分" : "Your Credits"}
                        </span>
                        <div className="flex items-center gap-2">
                          <Coins 
                            className={`h-4 w-4 ${userCredits >= 1 ? "text-yellow-500" : "text-red-500"}`} 
                          />
                          <span 
                            className={`text-lg font-semibold ${
                              userCredits >= 1 
                                ? "text-foreground" 
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {userCredits}
                          </span>
                        </div>
                      </div>

                      {userCredits < 1 && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-900">
                          <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
                            {isCN
                              ? "⚠️ 积分不足，需要 1 积分才能抽卡"
                              : "⚠️ Insufficient credits"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowConfirmDialog(false)}
                        disabled={drawCardLoading}
                      >
                        {isCN ? "取消" : "Cancel"}
                      </Button>

                      {userCredits >= 1 ? (
                        <Button
                          className="flex-1 bg-primary hover:bg-primary/90"
                          onClick={handleConfirmDrawCard}
                          disabled={drawCardLoading}
                        >
                          {drawCardLoading
                            ? isCN
                              ? "处理中..."
                              : "Processing..."
                            : isCN
                            ? "抽卡"
                            : "Draw"}
                        </Button>
                      ) : (
                        <Button
                          className="flex-1"
                          onClick={() => {
                            setShowConfirmDialog(false);
                            window.location.href = "/#pricing";
                          }}
                        >
                          {isCN ? "充值" : "Top Up"}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
