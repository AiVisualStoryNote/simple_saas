"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { request } from "@/lib/request";

interface NovelFile {
  id: number;
  file_type: string;
  file_url: string;
  file_name: string;
}

interface Character {
  id: number;
  novel_id: number;
  type: string;
  name: string;
  sex: string;
  age_type: string;
  species: string;
  body_type: string;
  text: string;
  design_img_id: number;
  design_img: NovelFile;
  created_at: string;
  updated_at: string;
}

interface CharactersResponse {
  characters: Character[];
}

interface CharacterDesignDialogProps {
  novelId: string;
  mkt: string | null;
  open: boolean;
  onClose: () => void;
}

const getLocalizedType = (type: string, isCN: boolean) => {
  return type;
};

export function CharacterDesignDialog({ novelId, mkt, open, onClose }: CharacterDesignDialogProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const isCN = mkt === "cn";

  useEffect(() => {
    if (open && novelId) {
      fetchCharacters();
    }
  }, [open, novelId]);

  useEffect(() => {
    if (!selectedImage) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedImage]);

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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
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
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
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
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {characters.map((character) => (
                      <div
                        key={character.id}
                        className="bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-shadow"
                      >
                        <div 
                          className="relative w-full aspect-[4/3] cursor-pointer"
                          onClick={() => character.design_img?.file_url && setSelectedImage(character.design_img.file_url)}
                        >
                          {character.design_img?.file_url ? (
                            <Image
                              src={character.design_img.file_url}
                              alt={character.name}
                              fill
                              className="object-cover hover:opacity-90 transition-opacity"
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
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                {isCN ? "年龄" : "Age"}: 
                              </span>{" "}
                              <span className="font-medium">{character.age_type}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                {isCN ? "物种" : "Species"}: 
                              </span>{" "}
                              <span className="font-medium">{character.species}</span>
                            </div>
                          </div>
                          {character.text && (
                            <p className="text-sm text-muted-foreground">
                              {character.text}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
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
                      handleZoomOut();
                    }}
                  >
                    <ZoomOut className="h-5 w-5" />
                  </Button>
                  <span className="text-white text-sm min-w-[50px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomIn();
                    }}
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white ml-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClosePreview();
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  ref={imageContainerRef}
                  className={`relative max-w-full max-h-full ${scale > 1 ? 'cursor-grab' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
                  style={{
                    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onWheel={handleWheel}
                  onDoubleClick={handleDoubleClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    src={selectedImage}
                    alt="Character design"
                    className="max-w-full max-h-[90vh] object-contain rounded-lg select-none"
                    style={{
                      transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                      transformOrigin: 'center center',
                    }}
                    draggable={false}
                  />
                </motion.div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                  {isCN 
                    ? "滚轮缩放 • 按钮缩放 • 双击切换 • 拖拽移动"
                    : "Scroll to zoom • Buttons to zoom • Double-click to toggle • Drag to pan"
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
