import { Grid, Cell, Direction } from "../types";
import { GAME_CONFIG } from "../constants";

let nextId = 0;

export function createEmptyGrid(): Grid {
  const grid: Grid = [];
  for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
      grid[row][col] = null;
    }
  }
  return grid;
}

export function createCell(row: number, col: number, value: number): Cell {
  return {
    id: nextId++,
    row,
    col,
    value,
    merged: false,
  };
}

export function addRandomCell(grid: Grid): Grid {
  const emptyCells: { row: number; col: number }[] = [];
  for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
    for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
      if (!grid[row][col]) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length === 0) return grid;

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  const newGrid = grid.map(row => [...row]);
  newGrid[row][col] = createCell(row, col, value);
  return newGrid;
}

export function initGame(): Grid {
  let grid = createEmptyGrid();
  grid = addRandomCell(grid);
  grid = addRandomCell(grid);
  return grid;
}

function mergeRow(row: (Cell | null)[]): (Cell | null)[] {
  let filled = row.filter(cell => cell !== null) as Cell[];
  if (filled.length === 0) return row;

  for (let i = 0; i < filled.length - 1; i++) {
    if (filled[i].value === filled[i + 1].value) {
      filled[i] = { ...filled[i], value: filled[i].value * 2, merged: true };
      filled[i + 1] = null!;
    }
  }

  filled = filled.filter(cell => cell !== null);

  while (filled.length < GAME_CONFIG.GRID_SIZE) {
    filled.push(null as unknown as Cell);
  }

  return filled;
}

function transpose(grid: Grid): Grid {
  const newGrid: Grid = [];
  for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
    newGrid[col] = [];
    for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
      newGrid[col][row] = grid[row][col];
    }
  }
  return newGrid;
}

function reverse(grid: Grid): Grid {
  return grid.map(row => [...row].reverse());
}

export function move(grid: Grid, direction: Direction): { grid: Grid; moved: boolean; scoreGained: number } {
  let newGrid = grid.map(row => [...row]);
  let scoreGained = 0;

  newGrid.forEach(row => {
    row.forEach(cell => {
      if (cell) cell.merged = false;
    });
  });

  switch (direction) {
    case "left":
      for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
        const mergedRow = mergeRow(newGrid[row]);
        mergedRow.forEach((cell, col) => {
          if (cell) {
            cell.row = row;
            cell.col = col;
            if (cell.merged) scoreGained += cell.value;
          }
          newGrid[row][col] = cell;
        });
      }
      break;

    case "right":
      newGrid = reverse(newGrid);
      for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
        const mergedRow = mergeRow(newGrid[row]);
        mergedRow.forEach((cell, col) => {
          if (cell) {
            cell.row = row;
            cell.col = col;
            if (cell.merged) scoreGained += cell.value;
          }
          newGrid[row][col] = cell;
        });
      }
      newGrid = reverse(newGrid);
      newGrid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            cell.row = r;
            cell.col = c;
          }
        });
      });
      break;

    case "up":
      newGrid = transpose(newGrid);
      for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
        const mergedRow = mergeRow(newGrid[col]);
        mergedRow.forEach((cell, row) => {
          if (cell) {
            cell.row = row;
            cell.col = col;
            if (cell.merged) scoreGained += cell.value;
          }
          newGrid[col][row] = cell;
        });
      }
      newGrid = transpose(newGrid);
      newGrid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            cell.row = r;
            cell.col = c;
          }
        });
      });
      break;

    case "down":
      newGrid = transpose(newGrid);
      newGrid = reverse(newGrid);
      for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
        const mergedRow = mergeRow(newGrid[col]);
        mergedRow.forEach((cell, row) => {
          if (cell) {
            cell.row = row;
            cell.col = col;
            if (cell.merged) scoreGained += cell.value;
          }
          newGrid[col][row] = cell;
        });
      }
      newGrid = reverse(newGrid);
      newGrid = transpose(newGrid);
      newGrid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            cell.row = r;
            cell.col = c;
          }
        });
      });
      break;
  }

  const moved = JSON.stringify(grid) !== JSON.stringify(newGrid);

  if (moved) {
    newGrid = addRandomCell(newGrid);
  }

  return { grid: newGrid, moved, scoreGained };
}

export function isGameOver(grid: Grid): boolean {
  for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
    for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
      if (!grid[row][col]) return false;
    }
  }

  for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
    for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
      const value = grid[row][col]?.value;
      if (value) {
        if (row < GAME_CONFIG.GRID_SIZE - 1 && grid[row + 1][col]?.value === value) return false;
        if (col < GAME_CONFIG.GRID_SIZE - 1 && grid[row][col + 1]?.value === value) return false;
      }
    }
  }

  return true;
}

export function hasWon(grid: Grid): boolean {
  for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
    for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
      if (grid[row][col]?.value === 2048) return true;
    }
  }
  return false;
}