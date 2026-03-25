"use client";

import { Trophy, RotateCcw } from "lucide-react";

interface GameHUDProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export function GameHUD({ score, highScore, onRestart }: GameHUDProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-4">
        <div className="bg-[#bbada0] px-4 py-2 rounded-lg text-center">
          <div className="text-xs text-[#eee4da] uppercase">Score</div>
          <div className="text-xl font-bold text-white">{score}</div>
        </div>
        <div className="bg-[#bbada0] px-4 py-2 rounded-lg text-center">
          <div className="text-xs text-[#eee4da] uppercase">Best</div>
          <div className="text-xl font-bold text-white">{highScore}</div>
        </div>
      </div>
      <button
        onClick={onRestart}
        className="bg-[#8f7a66] hover:bg-[#7a6a5a] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
        New Game
      </button>
    </div>
  );
}
