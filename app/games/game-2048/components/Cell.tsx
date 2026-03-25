"use client";

import { Cell as CellType } from "../types";
import { CELL_COLORS, EMPTY_CELL } from "../constants";

interface CellProps {
  cell: CellType | null;
}

export function Cell({ cell }: CellProps) {
  if (!cell) {
    return (
      <div
        className="rounded-md"
        style={{
          width: 70,
          height: 70,
          backgroundColor: EMPTY_CELL,
        }}
      />
    );
  }

  const colors = CELL_COLORS[cell.value] || CELL_COLORS[4096];

  const fontSize = cell.value < 100 ? 32 : cell.value < 1000 ? 28 : 22;

  return (
    <div
      className="rounded-md flex items-center justify-center font-bold transition-all"
      style={{
        width: 70,
        height: 70,
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize,
      }}
    >
      {cell.value}
    </div>
  );
}
