type BoardType = (number | null)[][];

function isValid(board: BoardType, row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}

function solveSudoku(board: BoardType): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function createEmptyBoard(): BoardType {
  return Array(9).fill(null).map(() => Array(9).fill(null));
}

function countSolutions(board: BoardType): number {
  let count = 0;
  function solve() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              solve();
              board[row][col] = null;
            }
          }
          return;
        }
      }
    }
    count++;
  }
  solve();
  return count;
}

export function generatePuzzle(difficulty: "easy" | "medium" | "hard"): { puzzle: BoardType; solution: BoardType } {
  const solution = createEmptyBoard();
  solveSudoku(solution);

  const puzzle = solution.map(row => [...row]);

  const cellsToRemove = difficulty === "easy" ? 35 : difficulty === "medium" ? 45 : 55;

  let removed = 0;
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }

  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  for (const [row, col] of positions) {
    if (removed >= cellsToRemove) break;
    puzzle[row][col] = null;
    removed++;
  }

  return { puzzle, solution };
}

export function checkWin(board: BoardType): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) return false;
    }
  }
  return true;
}