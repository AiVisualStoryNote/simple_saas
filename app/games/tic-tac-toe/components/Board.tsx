"use client";

import { Board as BoardType } from "../types";

interface BoardProps {
  board: BoardType;
  onCellClick: (index: number) => void;
}

export function Board({ board, onCellClick }: BoardProps) {
  return (
    <div
      className="grid grid-cols-3 gap-2 bg-gray-800 p-2 rounded-lg"
      style={{ width: 300, height: 300 }}
    >
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={cell !== null}
          className={`bg-gray-200 rounded-md flex items-center justify-center text-4xl font-bold hover:bg-gray-300 transition-colors disabled:cursor-default ${
            cell === "X" ? "text-blue-600" : cell === "O" ? "text-red-600" : ""
          }`}
        >
          {cell}
        </button>
      ))}
    </div>
  );
}
