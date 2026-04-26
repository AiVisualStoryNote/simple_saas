import { Cell, GameConfig } from "../types";

export function createEmptyGrid(config: GameConfig): Cell[][] {
  const grid: Cell[][] = [];
  for (let y = 0; y < config.rows; y++) {
    grid[y] = [];
    for (let x = 0; x < config.cols; x++) {
      grid[y][x] = { x, y, opened: false, hasLink: false, isMine: false, neighborMines: 0 };
    }
  }
  return grid;
}

export function placeMines(grid: Cell[][], config: GameConfig, firstX: number, firstY: number): Cell[][] {
  let minesPlaced = 0;
  const minePositions = new Set<string>();

  while (minesPlaced < config.mines) {
    const x = Math.floor(Math.random() * config.cols);
    const y = Math.floor(Math.random() * config.rows);

    if (x === firstX && y === firstY) continue;
    const key = `${x},${y}`;
    if (!minePositions.has(key)) {
      minePositions.add(key);
      grid[y][x].isMine = true;
      minesPlaced++;
    }
  }

  for (let y = 0; y < config.rows; y++) {
    for (let x = 0; x < config.cols; x++) {
      if (!grid[y][x].isMine) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < config.rows && nx >= 0 && nx < config.cols && grid[ny][nx].isMine) {
              count++;
            }
          }
        }
        grid[y][x].neighborMines = count;
        grid[y][x].hasLink = count > 0;
      }
    }
  }

  return grid;
}

export function revealCell(grid: Cell[][], x: number, y: number, config: GameConfig): { revealed: Cell[][], gamewon: boolean } {
  const cell = grid[y][x];
  if (cell.opened || cell.isMine) {
    return { revealed: grid, gamewon: false };
  }

  cell.opened = true;

  let remaining = config.rows * config.cols - config.mines;
  for (let r = 0; r < config.rows; r++) {
    for (let c = 0; c < config.cols; c++) {
      if (!grid[r][c].opened) remaining--;
    }
  }

  if (remaining === 0) {
    return { revealed: grid, gamewon: true };
  }

  if (!cell.hasLink) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const ny = y + dy;
        const nx = x + dx;
        if (ny >= 0 && ny < config.rows && nx >= 0 && nx < config.cols) {
          if (!grid[ny][nx].opened) {
            revealCell(grid, nx, ny, config);
          }
        }
      }
    }
  }

  return { revealed: grid, gamewon: false };
}

export function toggleFlag(grid: Cell[][], x: number, y: number): Cell[][] {
  grid[y][x].hasLink = !grid[y][x].hasLink;
  return grid;
}