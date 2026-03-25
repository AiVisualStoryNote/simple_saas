"use client";

import { CellValue } from "../types";
import { GameStats } from "../../constants";

interface GameResultProps {
  winner: CellValue;
  stats: GameStats;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameResult({ winner, stats, onRestart, onMenu }: GameResultProps) {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
      <div className="bg-white/95 p-8 rounded-2xl shadow-2xl w-80">
        <h2 className="text-3xl font-bold text-center mb-4">
          {winner === "X" ? "🎉 你赢了！" : winner === "O" ? "💻 AI赢了！" : "🤝 平局！"}
        </h2>
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">胜场</span>
            <span className="font-bold text-green-600">{stats.wins}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">负场</span>
            <span className="font-bold text-red-600">{stats.losses}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">平局</span>
            <span className="font-bold text-yellow-600">{stats.draws}</span>
          </div>
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
