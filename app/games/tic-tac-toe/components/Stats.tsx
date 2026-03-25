"use client";

import { GameStats } from "../types";

interface StatsProps {
  stats: GameStats;
}

export function Stats({ stats }: StatsProps) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="bg-green-100 px-4 py-2 rounded-lg text-center flex-1">
        <div className="text-sm text-gray-600">胜场</div>
        <div className="text-2xl font-bold text-green-600">{stats.wins}</div>
      </div>
      <div className="bg-red-100 px-4 py-2 rounded-lg text-center flex-1">
        <div className="text-sm text-gray-600">负场</div>
        <div className="text-2xl font-bold text-red-600">{stats.losses}</div>
      </div>
      <div className="bg-yellow-100 px-4 py-2 rounded-lg text-center flex-1">
        <div className="text-sm text-gray-600">平局</div>
        <div className="text-2xl font-bold text-yellow-600">{stats.draws}</div>
      </div>
    </div>
  );
}
