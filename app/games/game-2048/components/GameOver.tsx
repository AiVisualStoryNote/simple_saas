"use client";

import { Trophy, RefreshCw, Home } from "lucide-react";

interface GameOverProps {
  score: number;
  highScore: number;
  isWin: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOver({ score, highScore, isWin, onRestart, onMenu }: GameOverProps) {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-gradient-to-b from-orange-600 to-orange-800 p-8 rounded-3xl text-center max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-center mb-4">
          <Trophy className={`h-20 w-20 ${isWin ? "text-yellow-300 animate-bounce" : "text-gray-300"}`} />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">
          {isWin ? "You Win!" : "Game Over"}
        </h2>

        <div className="bg-white/10 rounded-2xl p-6 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Score</span>
            <span className="text-3xl font-bold text-white">{score}</span>
          </div>
          <div className="border-t border-white/20 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Best</span>
              <span className="text-xl font-bold text-yellow-300">{highScore}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onMenu}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium transition-colors"
          >
            <Home className="h-5 w-5" />
            Menu
          </button>
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
