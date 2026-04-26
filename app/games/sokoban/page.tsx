"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Board } from "./components/Board";
import { levels, levelsBoxCount } from "./levels/levels";

type Cell = 'empty' | 'wall' | 'box' | 'goal' | 'player' | 'box-on-goal' | 'player-on-goal';
type Direction = 'up' | 'down' | 'left' | 'right';

export default function SokobanGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [currentLevel, setCurrentLevel] = useState(0);
  const [board, setBoard] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [moves, setMoves] = useState(0);
  const [boxesOnGoal, setBoxesOnGoal] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const level = levels[currentLevel];
  const totalBoxes = levelsBoxCount[currentLevel];

  const initLevel = (levelIndex: number) => {
    const data = levels[levelIndex].map(row => [...row]);
    let player = { x: 0, y: 0 };
    let boxesDone = 0;
    let totalBoxes = 0;

    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < data[y].length; x++) {
        if (data[y][x] === 'player' || data[y][x] === 'player-on-goal') {
          player = { x, y };
        }
        if (data[y][x] === 'box' || data[y][x] === 'box-on-goal') {
          totalBoxes++;
        }
        if (data[y][x] === 'box-on-goal') {
          boxesDone++;
        }
      }
    }

    setBoard(data);
    setPlayerPos(player);
    setBoxesOnGoal(boxesDone);
    setMoves(0);
    setGameWon(boxesDone === totalBoxes);
  };

  useEffect(() => {
    initLevel(currentLevel);
  }, [currentLevel]);

  const canMove = (x: number, y: number): boolean => {
    if (x < 0 || y < 0 || y >= board.length || x >= board[0].length) {
      return false;
    }
    const cell = board[y][x];
    return cell !== 'wall';
  };

  const move = (direction: Direction) => {
    if (gameWon) return;

    const dx = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
    const dy = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (!canMove(newX, newY)) return;

    const newBoard = board.map(row => [...row]);
    const currentCell = newBoard[playerPos.y][playerPos.x];
    const targetCell = newBoard[newY][newX];

    // Moving into a box
    if (targetCell === 'box' || targetCell === 'box-on-goal') {
      const boxNewX = newX + dx;
      const boxNewY = newY + dy;

      if (!canMove(boxNewX, boxNewY)) return;
      const boxTargetCell = newBoard[boxNewY][boxNewX];

      // Can't push into another box
      if (boxTargetCell === 'box' || boxTargetCell === 'box-on-goal') return;

      // Move the box
      let newBoxesOnGoal = boxesOnGoal;
      if (targetCell === 'box-on-goal') newBoxesOnGoal--;
      if (boxTargetCell === 'goal') {
        newBoard[boxNewY][boxNewX] = 'box-on-goal';
        newBoxesOnGoal++;
      } else {
        newBoard[boxNewY][boxNewX] = 'box';
      }
      setBoxesOnGoal(newBoxesOnGoal);
    }

    // Move the player
    const isCurrentGoal = currentCell === 'player-on-goal';
    const isTargetGoal = targetCell === 'goal' || targetCell === 'player-on-goal' || targetCell === 'box-on-goal';

    newBoard[playerPos.y][playerPos.x] = isCurrentGoal ? 'goal' : 'empty';
    newBoard[newY][newX] = isTargetGoal ? 'player-on-goal' : 'player';

    setPlayerPos({ x: newX, y: newY });
    setBoard(newBoard);
    setMoves(moves + 1);

    // Check win
    if (boxesOnGoal === totalBoxes) {
      setGameWon(true);
    }
  };

  const restartLevel = () => {
    initLevel(currentLevel);
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  // Keyboard control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': e.preventDefault(); move('up'); break;
        case 'ArrowDown': e.preventDefault(); move('down'); break;
        case 'ArrowLeft': e.preventDefault(); move('left'); break;
        case 'ArrowRight': e.preventDefault(); move('right'); break;
        case 'r': e.preventDefault(); restartLevel(); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, board, gameWon]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-amber-100 dark:from-yellow-900 dark:to-amber-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold mb-2 text-amber-700 dark:text-amber-300">
            📦 {isZh ? "推箱子" : "Sokoban"}
          </h1>
          <p className="text-amber-600 dark:text-amber-300">
            {isZh ? `关卡 ${currentLevel + 1} / ${levels.length}` : `Level ${currentLevel + 1} / ${levels.length}`}
          </p>
        </div>

        <div className="flex justify-between items-center mb-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg p-3">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{isZh ? "步数" : "Moves"}</div>
            <div className="font-bold text-xl">{moves}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{isZh ? "目标" : "Goals"}</div>
            <div className="font-bold text-xl">{boxesOnGoal} / {totalBoxes}</div>
          </div>
          <button
            onClick={restartLevel}
            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg font-medium"
          >
            🔄 {isZh ? "重来" : "Restart"}
          </button>
        </div>

        <Board board={board} />

        {gameWon && (
          <div className="mt-4 text-center">
            <div className="inline-block bg-green-100 dark:bg-green-900/50 px-6 py-3 rounded-full mb-3">
              <span className="font-bold text-xl text-green-600 dark:text-green-400">
                🎉 {isZh ? "恭喜过关！" : "Level Completed!"}
              </span>
            </div>
            {currentLevel < levels.length - 1 && (
              <button
                onClick={nextLevel}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                ➡️ {isZh ? "下一关" : "Next Level"}
              </button>
            )}
            {currentLevel === levels.length - 1 && (
              <p className="text-green-600 dark:text-green-400 font-bold">
                {isZh ? "你通关了所有关卡！" : "You've completed all levels!"}
              </p>
            )}
          </div>
        )}

        {/* Touch controls for mobile */}
        <div className="mt-4 grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
          <div />
          <button
            onClick={() => move('up')}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg"
          >
            ▲
          </button>
          <div />
          <button
            onClick={() => move('left')}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg"
          >
            ◀
          </button>
          <button
            onClick={() => move('down')}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg"
          >
            ▼
          </button>
          <button
            onClick={() => move('right')}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg"
          >
            ▶
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-amber-600 dark:text-amber-400">
          {isZh ? "方向键或点击按钮移动，R键重开本关" : "Arrow keys or buttons to move, R to restart"}
        </div>
      </div>
    </div>
  );
}
