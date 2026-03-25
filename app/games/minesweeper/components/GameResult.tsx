"use client";

import { Difficulty } from "../../types";

interface GameResultProps {
  won: boolean;
  time: number;
  bestTime: number | null;
  difficulty: Difficulty;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameResult({ won, time, bestTime, difficulty, onRestart, onMenu }: GameResultProps) {
  const diffNames = {
    easy: "简单",
    medium: "中等",
    hard: "困难",
  };

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
      <div className="bg-white/95 p-8 rounded-2xl shadow-2xl w-80">
        <h2 className="text-3xl font-bold text-center mb-2">
          {won ? "🎉 恭喜扫雷成功！" : "💥 踩雷了！"}
        </h2>
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">难度</span>
            <span className="font-bold">{diffNames[difficulty.name]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">用时</span>
            <span className="font-bold">{time} 秒</span>
          </div>
          {won && bestTime !== null && (
            <div className="flex justify-between">
              <span className="text-gray-600">最佳</span>
              <span className="font-bold text-green-600">{bestTime} 秒</span>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            🔄 再来一局
          </button>
          <button
            onClick={onMenu}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            🏠 返回菜单
          </button>
        </div>
      </div>
    </div>
  );
}
