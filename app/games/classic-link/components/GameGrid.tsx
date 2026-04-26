"use client";

import { Cell as CellType } from "../types";
import { Cell } from "./Cell";

interface GameGridProps {
  grid: CellType[][];
  onCellClick: (x: number, y: number) => void;
  onCellToggle: (x: number, y: number) => void;
}

export function GameGrid({ grid, onCellClick, onCellToggle }: GameGridProps) {
  const config = { rows: grid.length, cols: grid[0].length };
  return (
    <div
      className="grid gap-1 mx-auto inline-block"
      style={{
        gridTemplateColumns: `repeat(${config.cols}, minmax(32px, 1fr))`,
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <Cell
            key={`${x}-${y}`}
            cell={cell}
            onClick={() => onCellClick(x, y)}
            onToggleFlag={(e) => {
              e.preventDefault();
              onCellToggle(x, y);
            }}
          />
        ))
      )}
    </div>
  );
}