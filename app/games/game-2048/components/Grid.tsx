"use client";

import { Grid as GridType } from "../types";
import { Cell } from "./Cell";
import { GRID_BG, GAME_CONFIG } from "../constants";

interface GridProps {
  grid: GridType;
}

export function GameGrid({ grid }: GridProps) {
  const cellSize = 70;
  const gap = 10;
  const totalSize = GAME_CONFIG.GRID_SIZE * (cellSize + gap) - gap;

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: GRID_BG, width: totalSize + 32 }}
    >
      <div
        className="grid gap-[10px]"
        style={{
          gridTemplateColumns: `repeat(${GAME_CONFIG.GRID_SIZE}, ${cellSize}px)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} cell={cell} />
          ))
        )}
      </div>
    </div>
  );
}