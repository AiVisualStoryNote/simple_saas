"use client";

import { Difficulty } from "../types";

interface StatusBarProps {
  flagsLeft: number;
  time: number;
  difficulty: Difficulty;
  onRestart: () => void;
}

const diffNames = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

export function StatusBar({ flagsLeft, time, difficulty, onRestart }: StatusBarProps) {
  return (
    <div className="flex justify-between items-center mb-4 bg-gray-200 p-3 rounded-lg border-2 border-gray-400">
      <div className="flex gap-4">
        <div className="bg-black text-red-500 px-3 py-1 rounded font-mono text-xl font-bold min-w-[60px] text-center">
          {flagsLeft.toString().padStart(3, "0")}
        </div>
        <div className="bg-black text-red-500 px-3 py-1 rounded font-mono text-xl font-bold min-w-[60px] text-center">
          {time.toString().padStart(3, "0")}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-medium">{diffNames[difficulty.name]}</span>
        <button
          onClick={onRestart}
          className="w-8 h-8 border-2 border-gray-400 bg-gray-300 hover:bg-gray-400 flex items-center justify-center rounded"
          title="重新开始"
        >
          🔄
        </button>
      </div>
    </div>
  );
}
