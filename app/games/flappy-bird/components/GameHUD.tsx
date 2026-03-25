"use client";

import { Pause, Trophy } from "lucide-react";

interface GameHUDProps {
  score: number;
  highScore: number;
  onPause: () => void;
}

export function GameHUD({ score, highScore, onPause }: GameHUDProps) {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
      <div className="flex flex-col gap-2">
        <div className="bg-black/50 text-white px-4 py-2 rounded-xl">
          <span className="text-2xl font-bold">{score}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex items-center gap-1 bg-black/50 px-3 py-2 rounded-xl text-yellow-400">
          <Trophy className="h-5 w-5" />
          <span className="font-bold">{highScore}</span>
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
