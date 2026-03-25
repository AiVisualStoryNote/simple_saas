"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameState, Grid, GameConfig } from "../types";
import { createEmptyGrid, placeMines, revealCell, toggleFlag, checkWin, revealAllMines } from "../utils/game-logic";
import { getBestTime, saveBestTime } from "../utils/storage";

interface Difficulty {
  name: "easy" | "medium" | "hard";
  config: GameConfig;
}

interface UseGameEngineProps {
  onGameOver: (won: boolean, time: number, bestTime: number | null) => void;
}

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>({
    name: "easy",
    config: { rows: 9, cols: 9, mines: 10 },
  });
  const [gameState, setGameState] = useState<GameState>("menu");
  const [grid, setGrid] = useState<Grid>([]);
  const [flagsLeft, setFlagsLeft] = useState(0);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback((name: "easy" | "medium" | "hard") => {
    const config = {
      easy: { rows: 9, cols: 9, mines: 10 },
      medium: { rows: 16, cols: 16, mines: 40 },
      hard: { rows: 16, cols: 30, mines: 99 },
    }[name];

    setDifficulty({ name, config });
    const newGrid = createEmptyGrid(config);
    setGrid(newGrid);
    setFlagsLeft(config.mines);
    setTime(0);
    setGameState("playing");
    setFirstClick(true);
    setBestTime(getBestTime(name));

    // 启动计时器
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  }, []);

  const restartGame = useCallback(() => {
    startGame(difficulty.name);
  }, [difficulty.name, startGame]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameState !== "playing") return;
    const cell = grid[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    let newGrid: Grid;

    // 第一次点击不会踩雷
    if (firstClick) {
      newGrid = placeMines(createEmptyGrid(difficulty.config), difficulty.config, row, col);
      newGrid = revealCell(newGrid, row, col, difficulty.config);
      setFirstClick(false);
    } else {
      if (cell.isMine) {
        // 踩雷，游戏结束
        newGrid = revealAllMines(grid);
        setGameState("lost");
        if (timerRef.current) clearInterval(timerRef.current);
        const currentBest = getBestTime(difficulty.name);
        onGameOver(false, time, currentBest);
        return;
      } else {
        newGrid = revealCell(grid, row, col, difficulty.config);
      }
    }

    setGrid(newGrid);

    // 检查胜利
    if (checkWin(newGrid, difficulty.config)) {
      setGameState("won");
      if (timerRef.current) clearInterval(timerRef.current);
      const currentBest = getBestTime(difficulty.name);
      const isNewBest = !currentBest || time < currentBest;
      if (isNewBest) {
        saveBestTime(difficulty.name, time);
        setBestTime(time);
      }
      onGameOver(true, time, isNewBest ? time : currentBest);
      return;
    }

    // 更新剩余旗子数
    const newFlagsLeft = newGrid.reduce(
      (count, row) => count + row.filter(cell => cell.isFlagged).length,
      0
    );
    setFlagsLeft(difficulty.config.mines - newFlagsLeft);
  }, [grid, gameState, difficulty, firstClick, time, onGameOver]);

  const handleRightClick = useCallback((e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== "playing") return;
    const cell = grid[row][col];
    if (cell.isRevealed) return;

    const newGrid = toggleFlag(grid, row, col);
    setGrid(newGrid);

    // 更新剩余旗子数
    const newFlagsLeft = newGrid.reduce(
      (count, r) => count + r.filter(c => c.isFlagged).length,
      0
    );
    setFlagsLeft(difficulty.config.mines - newFlagsLeft);
  }, [grid, gameState, difficulty, setGrid]);

  // 清理计时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    gameState,
    grid,
    difficulty,
    flagsLeft,
    time,
    bestTime,
    startGame,
    restartGame,
    handleCellClick,
    handleRightClick,
  };
}
