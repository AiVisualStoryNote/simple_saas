import { Grid, Cell, GameConfig } from "../types";

export function createEmptyGrid(config: GameConfig): Grid {
  const grid: Grid = [];
  let id = 0;
  for (let row = 0; row < config.rows; row++) {
    grid[row] = [];
    for (let col = 0; col < config.cols; col++) {
      grid[row][col] = {
        row,
        col,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      };
      id++;
    }
  }
  return grid;
}

export function placeMines(grid: Grid, config: GameConfig, excludeRow: number, excludeCol: number): Grid {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  let minesPlaced = 0;

  while (minesPlaced < config.mines) {
    const row = Math.floor(Math.random() * config.rows);
    const col = Math.floor(Math.random() * config.cols);

    // 不第一个点击位置放雷，也不重复放
    if (!newGrid[row][col].isMine && !(row === excludeRow && col === excludeCol)) {
      newGrid[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // 计算相邻雷数
  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      if (!newGrid[row][col].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols && newGrid[nr][nc].isMine) {
              count++;
            }
          }
        }
        newGrid[row][col].neighborMines = count;
      }
    }
  }

  return newGrid;
}

export function revealCell(grid: Grid, row: number, col: number, config: GameConfig): Grid {
  const newGrid = grid.map(r => r.map(c => ({ ...c })));
  const cell = newGrid[row][col];

  if (cell.isRevealed || cell.isFlagged) return newGrid;

  cell.isRevealed = true;

  // 如果是空白格子，递归展开
  if (cell.neighborMines === 0 && !cell.isMine) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
          revealCell(newGrid, nr, nc, config);
        }
      }
    }
  }

  return newGrid;
}

export function toggleFlag(grid: Grid, row: number, col: number): Grid {
  const newGrid = grid.map(r => r.map(c => ({ ...c })));
  if (!newGrid[row][col].isRevealed) {
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
  }
  return newGrid;
}

export function checkWin(grid: Grid, config: GameConfig): boolean {
  let revealedNonMines = 0;
  const totalNonMines = config.rows * config.cols - config.mines;

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      if (!grid[row][col].isMine && grid[row][col].isRevealed) {
        revealedNonMines++;
      }
    }
  }

  return revealedNonMines === totalNonMines;
}

export function revealAllMines(grid: Grid): Grid {
  return grid.map(row =>
    row.map(cell => {
      if (cell.isMine) {
        return { ...cell, isRevealed: true };
      }
      return cell;
    })
  );
}
