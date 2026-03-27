"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Board } from "./components/Board";
import { NumberPad } from "./components/NumberPad";
import { generatePuzzle } from "./utils/generator";
import { checkWin } from "./utils/check-win";

type BoardType = (number | null)[][];
type Difficulty = "easy" | "medium" | "hard";

export default function SudokuGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [board, setBoard] = useState<BoardType>([]);
  const [solution, setSolution] = useState<BoardType>([]);
  const [original, setOriginal] = useState<boolean[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameWon, setGameWon] = useState(false);

  const startNewGame = (diff: Difficulty = difficulty) => {
    const { puzzle, solution: sol } = generatePuzzle(diff);
    setBoard(puzzle);
    setSolution(sol);
    
    // Record which cells are original (given at start)
    const orig: boolean[][] = puzzle.map(row => 
      row.map(cell => cell !== null)
    );
    setOriginal(orig);
    
    setSelectedCell(null);
    setGameWon(false);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const fillNumber = (number: number | null) => {
    if (!selectedCell || gameWon) return;
    const { row, col } = selectedCell;
    if (original[row][col]) return; // Can't change original cells

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = number;
    setBoard(newBoard);

    // Check if game is won
    if (checkWin(newBoard)) {
      setGameWon(true);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const getHint = () => {
    if (!selectedCell || gameWon) return;
    if (original[selectedCell.row][selectedCell.col]) return;
    
    const num = solution[selectedCell.row][selectedCell.col];
    fillNumber(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold mb-2 text-blue-700 dark:text-blue-300">
            🔢 {isZh ? "数独" : "Sudoku"}
          </h1>
          <p className="text-blue-600 dark:text-blue-300">
            {isZh ? "经典数字益智游戏" : "Classic number puzzle game"}
          </p>
        </div>

        {gameWon && (
          <div className="mb-4 text-center">
            <div className="inline-block bg-green-100 dark:bg-green-900/50 px-6 py-3 rounded-full">
              <span className="font-bold text-xl text-green-600 dark:text-green-400">
                🎉 {isZh ? "恭喜完成！" : "Puzzle Solved!"}
              </span>
            </div>
          </div>
        )}

        <Board
          board={board}
          original={original}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
        />

        <NumberPad
          onNumberClick={fillNumber}
          onClear={() => fillNumber(null)}
          onHint={getHint}
          disabled={gameWon || !selectedCell || (selectedCell && original[selectedCell.row][selectedCell.col])}
          isZh={isZh}
        />

        <div className="mt-4 flex gap-2">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg p-2 flex gap-1">
            {(["easy", "medium", "hard"] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => {
                  setDifficulty(d);
                  startNewGame(d);
                }}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  difficulty === d
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300"
                }`}
              >
                {d === "easy" ? (isZh ? "简单" : "Easy") :
                 d === "medium" ? (isZh ? "中等" : "Medium") :
                 (isZh ? "困难" : "Hard")}
              </button>
            ))}
          </div>
          <button
            onClick={() => startNewGame()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors active:scale-95"
          >
            🔄 {isZh ? "新游戏" : "New Game"}
          </button>
        </div>
      </div>
    </div>
  );
}
