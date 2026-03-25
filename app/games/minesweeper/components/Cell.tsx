"use client";

import { Cell as CellType } from "../types";
import { NUMBER_COLORS } from "../constants";

interface CellProps {
  cell: CellType;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

export function Cell({ cell, onClick, onRightClick }: CellProps) {
  const size = 28;

  if (cell.isRevealed) {
    if (cell.isMine) {
      return (
        <div
          className="w-[28px] h-[28px] border border-black bg-red-500 flex items-center justify-center text-2xl"
          onClick={onClick}
          onContextMenu={onRightClick}
        >
          💣
        </div>
      );
    }

    if (cell.neighborMines === 0) {
      return (
        <div
          className="w-[28px] h-[28px] border border-gray-400 bg-gray-200"
          onClick={onClick}
          onContextMenu={onRightClick}
        />
      );
    }

    return (
      <div
        className={`w-[28px] h-[28px] border border-gray-400 bg-gray-200 flex items-center justify-center font-bold text-[${NUMBER_COLORS[cell.neighborMines]}]`}
        style={{ color: NUMBER_COLORS[cell.neighborMines] }}
        onClick={onClick}
        onContextMenu={onRightClick}
      >
        {cell.neighborMines}
      </div>
    );
  }

  if (cell.isFlagged) {
    return (
      <div
        className="w-[28px] h-[28px] border-2 border-gray-400 bg-gray-300 flex items-center justify-center text-xl"
        onClick={onClick}
        onContextMenu={onRightClick}
      >
        🚩
      </div>
    );
  }

  return (
    <div
      className="w-[28px] h-[28px] border-2 border-gray-400 bg-gray-300 hover:bg-gray-400 transition-colors"
      onClick={onClick}
      onContextMenu={onRightClick}
    />
  );
}
