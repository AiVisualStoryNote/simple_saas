"use client";

import React from "react";

interface GameHUDProps {
  score: number;
  highScore: number;
  playerHp: number;
  hasMultishot: number;
  onPause: () => void;
}

export function GameHUD({ score, highScore, playerHp, hasMultishot, onPause }: GameHUDProps) {
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
      <div className="flex gap-4">
        <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
          <div className="text-sm text-gray-300">分数</div>
          <div className="text-2xl font-bold text-yellow-400">{score}</div>
        </div>
        <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
          <div className="text-sm text-gray-300">最高分</div>
          <div className="text-xl font-bold text-gray-300">{highScore}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {hasMultishot > 0 && (
          <div className="bg-yellow-500/80 text-white px-2 py-1 rounded text-sm font-bold">
            🔥 x{hasMultishot}
          </div>
        )}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`text-2xl ${i < playerHp ? "❤️" : "🤍"}`}
            />
          ))}
        </div>
        <button
          onClick={onPause}
          className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg text-white hover:bg-black/80 transition-colors ml-2"
        >
          ⏸️
        </button>
      </div>
    </div>
  );
}
