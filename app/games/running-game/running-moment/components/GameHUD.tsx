"use client";

import { Heart, Pause, Coins } from "lucide-react";

interface GameHUDProps {
  distance: number;
  hp: number;
  coins: number;
  isZh: boolean;
  onPause: () => void;
}

export function GameHUD({ distance, hp, coins, isZh, onPause }: GameHUDProps) {
  const displayHp = Math.max(0, Math.floor(Number(hp) || 0));
  
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
      <div className="flex flex-col gap-2">
        <div className="bg-black/50 text-white px-4 py-2 rounded-xl">
          <span className="text-2xl font-bold">{Math.floor(distance)}</span>
          <span className="text-sm ml-1">m</span>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex items-center gap-1 bg-black/50 px-3 py-2 rounded-xl">
          {Array.from({ length: displayHp }).map((_, i) => (
            <span key={i} className="text-red-500">❤️</span>
          ))}
          {Array.from({ length: Math.max(0, 3 - displayHp) }).map((_, i) => (
            <span key={`gray-${i}`} className="text-gray-400">❤️</span>
          ))}
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
