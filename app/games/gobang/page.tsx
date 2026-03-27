"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Board } from "./components/Board";

type Player = "black" | "white";
type Cell = Player | null;
type BoardType = Cell[][];
const BOARD_SIZE = 15;

export default function GobangGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [board, setBoard] = useState<BoardType>(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>("black");
  const [winner, setWinner] = useState<Player | null>(null);

  const checkWin = (row: number, col: number, player: Player, b: BoardType): boolean => {
    const directions = [
      [1, 0], [0, 1], [1, 1], [1, -1]
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      
      // Check in one direction
      for (let i = 1; i < 5; i++) {
        const newRow = row + dy * i;
        const newCol = col + dx * i;
        if (
          newRow >= 0 && newRow < BOARD_SIZE && 
          newCol >= 0 && newCol < BOARD_SIZE && 
          b[newRow][newCol] === player
        ) {
          count++;
        } else break;
      }

      // Check in opposite direction
      for (let i = 1; i < 5; i++) {
        const newRow = row - dy * i;
        const newCol = col - dx * i;
        if (
          newRow >= 0 && newRow < BOARD_SIZE && 
          newCol >= 0 && newCol < BOARD_SIZE && 
          b[newRow][newCol] === player
        ) {
          count++;
        } else break;
      }

      if (count >= 5) return true;
    }

    return false;
  };

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] || winner) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    if (checkWin(row, col, currentPlayer, newBoard)) {
      setWinner(currentPlayer);
      return;
    }

    setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
  };

  const restartGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
    setCurrentPlayer("black");
    setWinner(null);
  };

  const getWinnerText = () => {
    if (!winner) return "";
    if (isZh) {
      return winner === "black" ? "黑子获胜！" : "白子获胜！";
    }
    return winner === "black" ? "Black wins!" : "White wins!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-amber-800 dark:text-amber-200">
            ⚫⚪ {isZh ? "五子棋" : "Gobang"}
          </h1>
          <p className="text-amber-600 dark:text-amber-300">
            {isZh ? "双人对弈，五连子获胜" : "Five in a row to win - 2 player game"}
          </p>
        </div>

        <div className="mb-4 text-center">
          {!winner ? (
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur px-6 py-2 rounded-full shadow">
              <span className={`w-4 h-4 rounded-full ${currentPlayer === "black" ? "bg-black" : "bg-white border border-gray-300"}`} />
              <span className="font-bold text-gray-700 dark:text-gray-200">
                {isZh ? "轮到" : ""} {currentPlayer === "black" ? (isZh ? "黑子" : "Black") : (isZh ? "白子" : "White")} {isZh ? "落子" : "turn"}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/50 px-6 py-2 rounded-full shadow">
              <span className="font-bold text-xl text-yellow-600 dark:text-yellow-400">
                🎉 {getWinnerText()}
              </span>
            </div>
          )}
        </div>

        <Board board={board} onCellClick={handleCellClick} />

        <div className="mt-6 text-center">
          <button
            onClick={restartGame}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            🔄 {isZh ? "重新开始" : "Restart Game"}
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-amber-600 dark:text-amber-400">
          {isZh ? "双人本地对弈，连成五个子获胜" : "Two players play locally, get five in a row to win"}
        </div>
      </div>
    </div>
  );
}
