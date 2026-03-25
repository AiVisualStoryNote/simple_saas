import { Board, CellValue } from "../types";
import { WINNING_COMBINATIONS } from "../constants";

export function checkWinner(board: Board): { winner: CellValue; combination: number[] | null } {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combination };
    }
  }

  return { winner: null, combination: null };
}

export function isBoardFull(board: Board): boolean {
  return board.every(cell => cell !== null);
}

export function getAiMove(board: Board): number {
  // 简单AI：优先找获胜，然后阻止玩家，然后随机
  // 检查AI能不能赢
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const newBoard = [...board];
      newBoard[i] = "O";
      if (checkWinner(newBoard).winner === "O") {
        return i;
      }
    }
  }

  // 阻止玩家赢
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const newBoard = [...board];
      newBoard[i] = "X";
      if (checkWinner(newBoard).winner === "X") {
        return i;
      }
    }
  }

  // 占中心
  if (!board[4]) return 4;

  // 随机选空位
  const emptyPositions = board
    .map((cell, index) => (cell === null ? index : null))
    .filter(val => val !== null) as number[];

  return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
}
