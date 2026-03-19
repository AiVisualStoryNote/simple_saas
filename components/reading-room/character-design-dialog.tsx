"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
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

// const typeLabels: Record<string, { en: string; cn: string }> = {
//   protagonist: { en: "Protagonist", cn: "主角" },
//   supporting: { en: "Supporting Character", cn: "配角" },
//   antagonist: { en: "Antagonist", cn: "反派" },
// };

const getLocalizedType = (type: string, isCN: boolean) => {
  // return typeLabels[type]?.[isCN ? "cn" : "en"] || (isCN ? "角色" : "Character");
  return type;
};

export function CharacterDesignDialog({ novelId, mkt, open, onClose }: CharacterDesignDialogProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isCN = mkt === "cn";

  useEffect(() => {
    if (open && novelId) {
      fetchCharacters();
    }
  }, [open, novelId]);

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
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
                className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 h-10 w-10 bg-white/10 hover:bg-white/20"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-5 w-5 text-white" />
                </Button>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative max-w-full max-h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={selectedImage}
                    alt="Character design"
                    width={800}
                    height={600}
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}