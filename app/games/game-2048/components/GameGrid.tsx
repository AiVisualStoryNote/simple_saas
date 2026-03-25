"use client";

import { Grid, Cell } from "../types";

interface GameGridProps {
  grid: Grid;
}

export function GameGrid({ grid }: GameGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2 p-4 bg-[#bbada0] rounded-lg">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="w-16 h-16 flex items-center justify-center rounded-md font-bold text-2xl"
            style={{
              backgroundColor: cell ? getCellColor(cell.value) : "#cdc1b4",
              color: cell ? getCellTextColor(cell.value) : "transparent",
            }}
          >
            {cell ? cell.value : ""}
          </div>
        ))
      )}
    </div>
  );
}

function getCellColor(value: number): string {
  const colors: Record<number, string> = {
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
  };
  return colors[value] || "#3c3a32";
}

function getCellTextColor(value: number): string {
  return value <= 4 ? "#776e65" : "#f9f6f2";
}