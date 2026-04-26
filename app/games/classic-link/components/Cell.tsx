"use client";

import { Cell as CellType } from "../types";

interface CellProps {
  cell: CellType;
  onClick: () => void;
  onToggleFlag: (e: React.MouseEvent) => void;
}

const getTextColor = (neighbors: number) => {
  const colors = [
    "",
    "text-blue-600",
    "text-green-600",
    "text-red-600",
    "text-purple-600",
    "text-yellow-700",
    "text-cyan-600",
    "text-black",
    "text-gray-600",
  ];
  return colors[neighbors] || "text-gray-600";
};

export function Cell({ cell, onClick, onToggleFlag }: CellProps) {
  if (cell.opened) {
    if (cell.isMine) {
      return (
        <div
          className="w-8 h-8 bg-red-500 border-2 border-gray-800 rounded flex items-center justify-center cursor-pointer"
          onClick={onClick}
          onContextMenu={(e) => {
            e.preventDefault();
            onToggleFlag(e);
          }}
        >
          💣
        </div>
      );
    }
    if (cell.hasLink && cell.neighborMines > 0) {
      return (
        <div
          className={`w-8 h-8 bg-gray-100 border-2 border-gray-400 rounded flex items-center justify-center font-bold ${getTextColor(cell.neighborMines)} cursor-pointer`}
          onClick={onClick}
          onContextMenu={(e) => {
            e.preventDefault();
            onToggleFlag(e);
          }}
        >
          {cell.neighborMines}
        </div>
      );
    }
    return (
      <div
        className="w-8 h-8 bg-gray-100 border-2 border-gray-400 rounded flex items-center justify-center cursor-pointer"
        onClick={onClick}
        onContextMenu={(e) => {
          e.preventDefault();
          onToggleFlag(e);
        }}
      />
    );
  }

  return (
    <div
      className={`w-8 h-8 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 ${
        cell.hasLink ? "border-green-500" : ""
      }`}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onToggleFlag(e);
      }}
    >
      {cell.hasLink && !cell.opened && (cell.isMine ? "🚩" : "🚩")}
    </div>
  );
}