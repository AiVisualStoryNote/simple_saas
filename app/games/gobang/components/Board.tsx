"use client";

import { Cell } from "../types";
const BOARD_SIZE = 15;

interface BoardProps {
  board: Cell[][];
  onCellClick: (row: number, col: number) => void;
}

export function Board({ board, onCellClick }: BoardProps) {
  return (
    <div className="aspect-square bg-amber-200 dark:bg-amber-800 rounded-lg shadow-lg relative overflow-hidden border-2 border-amber-300 dark:border-amber-700">
      {Array.from({ length: BOARD_SIZE }).map((_, row) => (
        <div key={row} className="flex h-[6.666%]">
          {Array.from({ length: BOARD_SIZE }).map((_, col) => {
            const cell = board[row][col];
            const isLastCol = col === BOARD_SIZE - 1;
            const isLastRow = row === BOARD_SIZE - 1;
            return (
              <div
                key={col}
                onClick={() => onCellClick(row, col)}
                className={`w-[6.666%] relative border-t border-l ${
                  isLastCol ? `border-r` : ''
                } ${isLastRow ? `border-b` : ''} border-amber-700/60 cursor-pointer hover:bg-amber-300/50 dark:hover:bg-amber-700/50 transition-colors`}
              >
                {cell && (
                  <div className={`absolute inset-[2px] rounded-full shadow-md ${
                    cell === "black" 
                      ? "bg-black" 
                      : "bg-white border border-gray-300"
                  }`} />
                )}
                {/* Intersection dots - 天元和星位 */}
                {((row === 3 || row === 7 || row === 11) && 
                  (col === 3 || col === 7 || col === 11)) && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-800 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
