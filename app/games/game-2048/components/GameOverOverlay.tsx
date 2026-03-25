"use client";

import { GameState } from "../types";

interface GameOverOverlayProps {
  gameState: GameState;
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onRestart: () => void;
  onContinue: () => void;
}

export function GameOverOverlay({
  gameState,
  score,
  bestScore,
  isNewBest,
  onRestart,
  onContinue,
}: GameOverOverlayProps) {
  if (gameState !== "won" && gameState !== "gameover") return null;

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
      <div className="bg-white/95 p-8 rounded-2xl shadow-2xl w-80 text-center">
        <h2 className="text-3xl font-bold mb-2">
          {gameState === "won" ? "🎉 恭喜！" : "游戏结束"}
        </h2>
        {isNewBest && (
          <div className="text-yellow-600 font-bold text-lg mb-4 animate-bounce">
            🏆 新纪录！🏆
          </div>
        )}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">分数</span>
            <span className="text-xl font-bold">{score}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">最高分</span>
            <span className="text-xl font-bold">{bestScore}</span>
          </div>
        </div>
        <div className="space-y-3">
          {gameState === "won" && (
            <button
              onClick={onContinue}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
            >
              继续游戏
            </button>
          )}
          <button
            onClick={onRestart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            🔄 重新开始
          </button>
        </div>
      </div>
    </div>
  );
}
