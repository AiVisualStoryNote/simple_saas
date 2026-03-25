"use client";

import { Grid as GridType } from "../types";
import { Cell } from "./Cell";

interface GridProps {
  grid: GridType;
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (e: React.MouseEvent, row: number, col: number) => void;
}

export function GameGrid({ grid, onCellClick, onCellRightClick }: GridProps) {
  return (
    <div
      className="border-2 border-gray-400 bg-gray-400 inline-block"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${grid[0]?.length || 0}, 28px)`,
        gap: 1,
        padding: 4,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
            onRightClick={(e) => onCellRightClick(e, rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}
