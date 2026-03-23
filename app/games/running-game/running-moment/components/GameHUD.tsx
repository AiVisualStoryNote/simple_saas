"use client";

import { Heart, Pause, Coins } from "lucide-react";

interface GameHUDProps {
  distance: number;
  hp: number;
  maxHp: number;
  coins: number;
  isZh: boolean;
  isHurt: boolean;
  isInvincible: boolean;
  onPause: () => void;
}

export function GameHUD({ distance, hp, maxHp, coins, isZh, isHurt, isInvincible, onPause }: GameHUDProps) {
  const displayHp = Math.max(0, Math.floor(Number(hp) || 0));
  const displayMaxHp = Math.max(displayHp, Math.floor(Number(maxHp) || 0));
  
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
      <div className="flex flex-col gap-2">
        <div className="bg-black/50 text-white px-4 py-2 rounded-xl">
          <span className="text-2xl font-bold">{Math.floor(distance)}</span>
          <span className="text-sm ml-1">m</span>
        </div>
      </div>

      <div className="flex gap-3">
        <div
          className={`flex items-center gap-1 rounded-xl border px-3 py-2 transition-all duration-200 ${
            isHurt
              ? "border-red-400 bg-red-950/70 shadow-[0_0_24px_rgba(248,113,113,0.65)] animate-pulse"
              : "border-white/10 bg-black/50"
          } ${isInvincible ? "shadow-[0_0_20px_rgba(250,204,21,0.35)]" : ""}`}
        >
          {Array.from({ length: displayHp }).map((_, i) => (
            <Heart
              key={i}
              className={`h-5 w-5 transition-all ${
                isInvincible
                  ? "text-yellow-300 fill-yellow-300 drop-shadow-[0_0_6px_rgba(253,224,71,0.95)]"
                  : "text-red-500 fill-red-500"
              }`}
              aria-hidden="true"
            />
          ))}
          {Array.from({ length: Math.max(0, displayMaxHp - displayHp) }).map((_, i) => (
            <Heart
              key={`gray-${i}`}
              className="h-5 w-5 text-gray-400 fill-transparent"
              aria-hidden="true"
            />
          ))}
          <span
            className={`ml-2 text-xs font-semibold uppercase tracking-[0.2em] ${
              isHurt ? "text-red-200" : isInvincible ? "text-yellow-200" : "text-white/80"
            }`}
          >
            {isInvincible ? (isZh ? "无敌" : "Invincible") : isHurt ? (isZh ? "受伤" : "Hit") : "HP"}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-black/50 px-3 py-2 rounded-xl text-yellow-500">
          <Coins className="h-5 w-5" />
          <span className="font-bold">{coins}</span>
        </div>

        <button
          onClick={onPause}
          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-xl transition-colors"
        >
          <Pause className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
