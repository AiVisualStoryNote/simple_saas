"use client";

import { Cell } from "../types";

interface BoardProps {
  board: Cell[][];
}

const cellColors: Record<Cell, string> = {
  'empty': 'bg-gray-200 dark:bg-gray-700',
  'wall': 'bg-gray-600 dark:bg-gray-900',
  'box': 'bg-amber-600 dark:bg-amber-700',
  'goal': 'bg-green-200 dark:bg-green-900 ring-2 ring-green-500',
  'player': 'bg-blue-500 dark:bg-blue-600',
  'box-on-goal': 'bg-green-500 dark:bg-green-600 ring-2 ring-green-500',
  'player-on-goal': 'bg-blue-500 dark:bg-blue-600 ring-2 ring-green-500',
};

const cellEmojis: Record<Cell, string> = {
  'empty': '',
  'wall': '🧱',
  'box': '📦',
  'goal': '🎯',
  'player': '🧑',
  'box-on-goal': '✅📦',
  'player-on-goal': '🧑',
};

export function Board({ board }: BoardProps) {
  return (
    <div className="inline-block mx-auto border-4 border-amber-700 dark:border-amber-300 rounded-lg overflow-hidden bg-amber-100 dark:bg-amber-900">
      {board.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-amber-300 dark:border-amber-700 ${cellColors[cell]}`}
            >
              <span className="text-lg">{cellEmojis[cell]}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
