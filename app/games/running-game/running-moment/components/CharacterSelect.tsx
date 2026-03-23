"use client";

import { useState } from "react";
import { CHARACTERS } from "../constants";
import { Character } from "../types/index";
import { getProgress } from "../utils/storage";
import { ShoppingCart, Lock, Star } from "lucide-react";

interface CharacterSelectProps {
  isZh: boolean;
  onSelect: (characterId: string) => void;
  onOpenShop: () => void;
}

const abilityLabels: Record<string, { en: string; cn: string }> = {
  none: { en: "None", cn: "无" },
  doubleJump: { en: "Double Jump", cn: "二段跳" },
  dash: { en: "Dash", cn: "冲刺" },
};

export function CharacterSelect({ isZh, onSelect, onOpenShop }: CharacterSelectProps) {
  const [selectedId, setSelectedId] = useState("runner");
  const progress = getProgress();

  const handleSelect = (char: Character) => {
    const isUnlocked = progress.charactersUnlocked.includes(char.id);
    if (isUnlocked) {
      setSelectedId(char.id);
    }
  };

  const handleStart = () => {
    onSelect(selectedId);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {isZh ? "选择角色" : "Choose Your Character"}
        </h2>
        <p className="text-muted-foreground">
          {isZh ? "选择一个角色开始游戏" : "Select a character to start"}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {CHARACTERS.map((char) => {
          const isUnlocked = progress.charactersUnlocked.includes(char.id);
          const isSelected = selectedId === char.id;

          return (
            <div
              key={char.id}
              onClick={() => handleSelect(char)}
              className={`relative w-40 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/10 scale-105"
                  : "border-border hover:border-primary/50"
              } ${!isUnlocked ? "opacity-60" : ""}`}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-2xl">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
              )}

              <div className="text-center">
                <div className="text-5xl mb-2">{char.icon}</div>
                <h3 className="font-bold">{isZh ? char.nameCn : char.name}</h3>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-red-500">❤️</span>
                  <span className="text-sm">{char.hp}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {abilityLabels[char.ability]?.[isZh ? "cn" : "en"] || "None"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {char.speed}x {isZh ? "速度" : "Speed"}
                </div>
              </div>

              {isSelected && (
                <div className="absolute -top-2 -right-2">
                  <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                </div>
              )}

              {!isUnlocked && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <ShoppingCart className="h-3 w-3" />
                    {char.unlockCost}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onOpenShop}
          className="px-6 py-3 rounded-xl border-2 border-yellow-500 text-yellow-500 font-medium hover:bg-yellow-500/10 transition-colors"
        >
          {isZh ? "商店" : "Shop"}
        </button>
        <button
          onClick={handleStart}
          className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
        >
          {isZh ? "开始游戏" : "Start Game"}
        </button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        {isZh ? "最高分" : "High Score"}: {progress.highScore}m | 
        {isZh ? " 金币" : " Coins"}: {progress.totalCoins}
      </div>
    </div>
  );
}
